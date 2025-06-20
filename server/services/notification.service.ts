import { db } from '../db';
import { notifications, users, athletes, scouts } from '../../shared/schema';
import { eq, and, desc, isNull, lte, sql } from 'drizzle-orm';
import { emailService } from './email.service';
import type { InsertNotification, Notification } from '../../shared/schema';

export class NotificationService {
  /**
   * Create a notification
   */
  async createNotification(data: InsertNotification): Promise<Notification> {
    const [notification] = await db.insert(notifications)
      .values(data)
      .returning();
    
    // Optionally send email for important notifications
    if (this.shouldSendEmail(data.type)) {
      this.sendEmailNotification(notification).catch(console.error);
    }
    
    return notification;
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(
    userId: string, 
    options?: {
      unreadOnly?: boolean;
      limit?: number;
      offset?: number;
    }
  ): Promise<Notification[]> {
    const conditions = [
      eq(notifications.userId, userId),
      options?.unreadOnly ? eq(notifications.read, false) : undefined,
      // Exclude expired notifications
      lte(notifications.expiresAt, new Date())
    ].filter(Boolean);

    const baseQuery = db.select()
      .from(notifications)
      .where(and(...conditions))
      .orderBy(desc(notifications.createdAt))
      .limit(options?.limit || 50);
    
    if (options?.offset) {
      return await baseQuery.offset(options.offset);
    }
    
    return await baseQuery;
  }

  /**
   * Mark notifications as read
   */
  async markAsRead(userId: string, notificationIds: number[]): Promise<void> {
    await db.update(notifications)
      .set({ 
        read: true, 
        readAt: new Date() 
      })
      .where(
        and(
          eq(notifications.userId, userId),
          // Ensure user owns these notifications
          sql`${notifications.id} = ANY(${notificationIds})`
        )
      );
  }

  /**
   * Get unread count
   */
  async getUnreadCount(userId: string): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, userId),
          eq(notifications.read, false),
          // Exclude expired
          sql`${notifications.expiresAt} IS NULL OR ${notifications.expiresAt} > NOW()`
        )
      );
    
    return result[0]?.count || 0;
  }

  /**
   * Delete old notifications
   */
  async cleanupOldNotifications(daysToKeep: number = 30): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    
    await db.delete(notifications)
      .where(
        and(
          lte(notifications.createdAt, cutoffDate),
          eq(notifications.read, true)
        )
      );
  }

  /**
   * Notification Templates
   */
  async notifyScoutView(athleteId: number, scoutId: number): Promise<void> {
    const [athlete] = await db.select()
      .from(athletes)
      .where(eq(athletes.id, athleteId));
    
    const [scout] = await db.select()
      .from(scouts)
      .where(eq(scouts.id, scoutId));
    
    if (!athlete || !scout) return;
    
    await this.createNotification({
      userId: athlete.userId,
      type: 'scout_view',
      title: 'Perfil Visualizado',
      message: `${scout.organization} visualizou seu perfil`,
      actionUrl: '/athlete/activity',
      metadata: {
        scoutId,
        scoutName: scout.fullName,
        organization: scout.organization
      }
    });
  }

  async notifyAchievementUnlocked(
    userId: string, 
    achievement: { 
      title: string; 
      description?: string; 
      points?: number;
      icon?: string;
    }
  ): Promise<void> {
    await this.createNotification({
      userId,
      type: 'achievement',
      title: 'Conquista Desbloqueada!',
      message: achievement.title,
      actionUrl: '/athlete/achievements',
      imageUrl: `/icons/achievements/${achievement.icon || 'trophy'}.svg`,
      metadata: achievement
    });
  }

  async notifyTestResult(
    userId: string,
    test: {
      type: string;
      result: number;
      verified: boolean;
      percentile?: number;
    }
  ): Promise<void> {
    const testNames: Record<string, string> = {
      speed_20m: 'Velocidade 20m',
      agility_5_10_5: 'Agilidade 5-10-5',
      vertical_jump: 'Salto Vertical',
      technical_skills: 'Habilidades Técnicas'
    };
    
    await this.createNotification({
      userId,
      type: 'test_result',
      title: test.verified ? 'Teste Verificado!' : 'Resultado do Teste',
      message: `${testNames[test.type] || test.type}: ${test.result}${test.percentile ? ` (Top ${test.percentile}%)` : ''}`,
      actionUrl: '/athlete/combine',
      metadata: test
    });
  }

  async notifySubscriptionChange(
    userId: string,
    change: {
      type: 'activated' | 'renewed' | 'cancelled' | 'expired';
      planName: string;
    }
  ): Promise<void> {
    const messages = {
      activated: `Parabéns! Seu plano ${change.planName} foi ativado.`,
      renewed: `Seu plano ${change.planName} foi renovado com sucesso.`,
      cancelled: `Seu plano ${change.planName} foi cancelado e expirará no final do período.`,
      expired: `Seu plano ${change.planName} expirou.`
    };
    
    await this.createNotification({
      userId,
      type: 'subscription',
      title: 'Atualização de Assinatura',
      message: messages[change.type],
      actionUrl: '/athlete/subscription',
      metadata: change
    });
  }

  async notifyParentalConsentRequired(athleteId: number, parentEmail: string): Promise<void> {
    const [athlete] = await db.select()
      .from(athletes)
      .where(eq(athletes.id, athleteId));
    
    if (!athlete) return;
    
    await this.createNotification({
      userId: athlete.userId,
      type: 'parental_consent',
      title: 'Autorização Necessária',
      message: `Enviamos um email para ${parentEmail} solicitando autorização.`,
      actionUrl: '/athlete/profile',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      metadata: { parentEmail }
    });
  }

  /**
   * Private methods
   */
  private shouldSendEmail(type: string): boolean {
    // Define which notification types should trigger emails
    const emailTypes = ['subscription', 'parental_consent', 'test_result'];
    return emailTypes.includes(type);
  }

  private async sendEmailNotification(notification: Notification): Promise<void> {
    try {
      const [user] = await db.select()
        .from(users)
        .where(eq(users.id, notification.userId));
      
      if (!user || !user.emailVerified) return;
      
      // Simple email notification - you can expand this with templates
      // This is a placeholder - implement based on notification type
      console.log(`Would send email to ${user.email} for notification:`, notification.title);
      
      // Mark as email sent
      await db.update(notifications)
        .set({ emailSent: true })
        .where(eq(notifications.id, notification.id));
    } catch (error) {
      console.error('Failed to send notification email:', error);
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();