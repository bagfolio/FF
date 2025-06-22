// Webhook logger for monitoring Stripe events

export interface WebhookEvent {
  eventId: string;
  eventType: string;
  status: 'received' | 'processing' | 'completed' | 'failed';
  payload?: any;
  error?: string;
  processingTime?: number;
}

export class WebhookLogger {
  private static events: WebhookEvent[] = [];
  private static maxEvents = 100; // Keep last 100 events in memory

  static async logEvent(event: WebhookEvent): Promise<void> {
    // Add to in-memory storage
    this.events.unshift(event);
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(0, this.maxEvents);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Webhook ${event.status}] ${event.eventType} - ${event.eventId}`);
      if (event.error) {
        console.error(`[Webhook Error] ${event.error}`);
      }
    }

    // TODO: In production, you might want to store these in a database table
    // For now, we'll just keep them in memory for debugging
  }

  static getRecentEvents(limit: number = 20): WebhookEvent[] {
    return this.events.slice(0, limit);
  }

  static getEventsByType(eventType: string): WebhookEvent[] {
    return this.events.filter(e => e.eventType === eventType);
  }

  static getFailedEvents(): WebhookEvent[] {
    return this.events.filter(e => e.status === 'failed');
  }

  static clearEvents(): void {
    this.events = [];
  }

  // Helper to log webhook processing time
  static async trackProcessingTime(
    eventId: string,
    eventType: string,
    processFunction: () => Promise<void>
  ): Promise<void> {
    const startTime = Date.now();
    
    await this.logEvent({
      eventId,
      eventType,
      status: 'processing'
    });

    try {
      await processFunction();
      
      const processingTime = Date.now() - startTime;
      await this.logEvent({
        eventId,
        eventType,
        status: 'completed',
        processingTime
      });
    } catch (error) {
      const processingTime = Date.now() - startTime;
      await this.logEvent({
        eventId,
        eventType,
        status: 'failed',
        error: error instanceof Error ? error.message : String(error),
        processingTime
      });
      throw error;
    }
  }
}

// Export a function to get webhook status for monitoring
export function getWebhookHealth() {
  const recentEvents = WebhookLogger.getRecentEvents(50);
  const failedCount = recentEvents.filter(e => e.status === 'failed').length;
  const successCount = recentEvents.filter(e => e.status === 'completed').length;
  const avgProcessingTime = recentEvents
    .filter(e => e.processingTime)
    .reduce((acc, e) => acc + (e.processingTime || 0), 0) / 
    (recentEvents.filter(e => e.processingTime).length || 1);

  return {
    totalEvents: recentEvents.length,
    failedCount,
    successCount,
    failureRate: recentEvents.length > 0 ? (failedCount / recentEvents.length) * 100 : 0,
    avgProcessingTime: Math.round(avgProcessingTime),
    lastEventTime: recentEvents[0]?.eventId ? new Date().toISOString() : null,
    status: failedCount > 5 ? 'unhealthy' : 'healthy'
  };
}