import type { Express, Request, Response } from '../types/express';
import { notificationService } from '../services/notification.service';
import { z } from 'zod';

export function setupNotificationRoutes(app: Express) {
  // Get user notifications
  app.get('/api/notifications', async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId || (req as any).user?.claims?.sub;
      
      if (!userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const { unreadOnly, limit, offset } = req.query;
      
      const notifications = await notificationService.getUserNotifications(userId, {
        unreadOnly: unreadOnly === 'true',
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined
      });
      
      res.json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ message: 'Failed to fetch notifications' });
    }
  });

  // Get unread count
  app.get('/api/notifications/unread-count', async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId || (req as any).user?.claims?.sub;
      
      if (!userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const count = await notificationService.getUnreadCount(userId);
      
      res.json({ count });
    } catch (error) {
      console.error('Error fetching unread count:', error);
      res.status(500).json({ message: 'Failed to fetch unread count' });
    }
  });

  // Mark notifications as read
  app.put('/api/notifications/read', async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId || (req as any).user?.claims?.sub;
      
      if (!userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const schema = z.object({
        notificationIds: z.array(z.number()).min(1)
      });
      
      const { notificationIds } = schema.parse(req.body);
      
      await notificationService.markAsRead(userId, notificationIds);
      
      res.json({ message: 'Notifications marked as read' });
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid request', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to mark notifications as read' });
    }
  });

  // Mark all as read
  app.put('/api/notifications/read-all', async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId || (req as any).user?.claims?.sub;
      
      if (!userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      // Get all unread notification IDs
      const unreadNotifications = await notificationService.getUserNotifications(userId, {
        unreadOnly: true
      });
      
      if (unreadNotifications.length > 0) {
        const ids = unreadNotifications.map(n => n.id);
        await notificationService.markAsRead(userId, ids);
      }
      
      res.json({ message: 'All notifications marked as read' });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      res.status(500).json({ message: 'Failed to mark all notifications as read' });
    }
  });

  // Test notification creation (for development)
  if (process.env.NODE_ENV !== 'production') {
    app.post('/api/notifications/test', async (req: Request, res: Response) => {
      try {
        const userId = (req as any).session?.userId || (req as any).user?.claims?.sub;
        
        if (!userId) {
          return res.status(401).json({ message: 'Not authenticated' });
        }
        
        const notification = await notificationService.createNotification({
          userId,
          type: 'system',
          title: 'Notificação de Teste',
          message: 'Esta é uma notificação de teste do sistema.',
          actionUrl: '/home',
          metadata: { test: true }
        });
        
        res.json(notification);
      } catch (error) {
        console.error('Error creating test notification:', error);
        res.status(500).json({ message: 'Failed to create test notification' });
      }
    });
  }
}