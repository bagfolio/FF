interface QueueItem<T = any> {
  id: string;
  timestamp: number;
  type: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  data?: T;
  headers?: Record<string, string>;
  retryCount: number;
  maxRetries: number;
  priority: number;
  metadata?: Record<string, any>;
}

interface QueueConfig {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  storageKey?: string;
  onlineCheckInterval?: number;
}

type QueueEventType = 'queued' | 'processing' | 'success' | 'error' | 'retry' | 'cleared';

interface QueueEvent<T = any> {
  type: QueueEventType;
  item?: QueueItem<T>;
  error?: Error;
  queueSize?: number;
}

type QueueListener<T = any> = (event: QueueEvent<T>) => void;

class OfflineQueueManager {
  private queue: QueueItem[] = [];
  private config: Required<QueueConfig>;
  private isProcessing = false;
  private listeners: Set<QueueListener> = new Set();
  private onlineCheckInterval: number | null = null;
  private isOnline = navigator.onLine;

  constructor(config: QueueConfig = {}) {
    this.config = {
      maxRetries: config.maxRetries ?? 3,
      baseDelay: config.baseDelay ?? 1000,
      maxDelay: config.maxDelay ?? 30000,
      storageKey: config.storageKey ?? 'offline_queue',
      onlineCheckInterval: config.onlineCheckInterval ?? 5000
    };

    this.loadQueue();
    this.setupEventListeners();
    this.startOnlineCheck();

    // Process queue if we're online
    if (this.isOnline) {
      this.processQueue();
    }
  }

  private setupEventListeners(): void {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  }

  private handleOnline = (): void => {
    this.isOnline = true;
    this.processQueue();
  };

  private handleOffline = (): void => {
    this.isOnline = false;
  };

  private handleBeforeUnload = (): void => {
    this.saveQueue();
  };

  private startOnlineCheck(): void {
    if (this.onlineCheckInterval) {
      clearInterval(this.onlineCheckInterval);
    }

    this.onlineCheckInterval = window.setInterval(() => {
      if (!this.isOnline && navigator.onLine) {
        this.handleOnline();
      } else if (this.isOnline && !navigator.onLine) {
        this.handleOffline();
      }
    }, this.config.onlineCheckInterval);
  }

  private loadQueue(): void {
    try {
      const stored = localStorage.getItem(this.config.storageKey);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load offline queue from storage:', error);
      this.queue = [];
    }
  }

  private saveQueue(): void {
    try {
      localStorage.setItem(this.config.storageKey, JSON.stringify(this.queue));
    } catch (error) {
      console.error('Failed to save offline queue to storage:', error);
    }
  }

  public enqueue<T = any>(
    type: string,
    method: QueueItem['method'],
    url: string,
    data?: T,
    options: {
      headers?: Record<string, string>;
      priority?: number;
      maxRetries?: number;
      metadata?: Record<string, any>;
    } = {}
  ): string {
    const item: QueueItem<T> = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      type,
      method,
      url,
      data,
      headers: options.headers,
      retryCount: 0,
      maxRetries: options.maxRetries ?? this.config.maxRetries,
      priority: options.priority ?? 0,
      metadata: options.metadata
    };

    this.queue.push(item);
    this.sortQueue();
    this.saveQueue();
    this.emit({ type: 'queued', item, queueSize: this.queue.length });

    // Try to process immediately if online
    if (this.isOnline && !this.isProcessing) {
      this.processQueue();
    }

    return item.id;
  }

  private sortQueue(): void {
    this.queue.sort((a, b) => {
      // Sort by priority (higher first), then by timestamp (older first)
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      return a.timestamp - b.timestamp;
    });
  }

  private async processQueue(): Promise<void> {
    if (!this.isOnline || this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0 && this.isOnline) {
      const item = this.queue[0];
      
      try {
        this.emit({ type: 'processing', item, queueSize: this.queue.length });
        
        const response = await this.executeRequest(item);
        
        // Remove successful item from queue
        this.queue.shift();
        this.saveQueue();
        this.emit({ type: 'success', item, queueSize: this.queue.length });
      } catch (error) {
        const shouldRetry = this.handleRequestError(item, error as Error);
        
        if (!shouldRetry) {
          // Remove failed item from queue after max retries
          this.queue.shift();
          this.saveQueue();
          this.emit({ type: 'error', item, error: error as Error, queueSize: this.queue.length });
        }
      }
    }

    this.isProcessing = false;
  }

  private async executeRequest(item: QueueItem): Promise<Response> {
    const options: RequestInit = {
      method: item.method,
      headers: {
        'Content-Type': 'application/json',
        ...item.headers
      }
    };

    if (item.data && ['POST', 'PUT', 'PATCH'].includes(item.method)) {
      options.body = JSON.stringify(item.data);
    }

    const response = await fetch(item.url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  }

  private handleRequestError(item: QueueItem, error: Error): boolean {
    item.retryCount++;

    if (item.retryCount >= item.maxRetries) {
      return false; // Don't retry anymore
    }

    // Calculate delay with exponential backoff
    const delay = Math.min(
      this.config.baseDelay * Math.pow(2, item.retryCount - 1),
      this.config.maxDelay
    );

    this.emit({ type: 'retry', item, error, queueSize: this.queue.length });

    // Schedule retry
    setTimeout(() => {
      if (this.isOnline && !this.isProcessing) {
        this.processQueue();
      }
    }, delay);

    return true; // Will retry
  }

  public getQueue(): ReadonlyArray<QueueItem> {
    return [...this.queue];
  }

  public getQueueSize(): number {
    return this.queue.length;
  }

  public clearQueue(): void {
    this.queue = [];
    this.saveQueue();
    this.emit({ type: 'cleared', queueSize: 0 });
  }

  public removeItem(id: string): boolean {
    const index = this.queue.findIndex(item => item.id === id);
    if (index !== -1) {
      this.queue.splice(index, 1);
      this.saveQueue();
      return true;
    }
    return false;
  }

  public subscribe(listener: QueueListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(event: QueueEvent): void {
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in queue listener:', error);
      }
    });
  }

  public destroy(): void {
    if (this.onlineCheckInterval) {
      clearInterval(this.onlineCheckInterval);
    }
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    this.listeners.clear();
  }

  public isQueueEmpty(): boolean {
    return this.queue.length === 0;
  }

  public getOnlineStatus(): boolean {
    return this.isOnline;
  }
}

// Singleton instance
let queueInstance: OfflineQueueManager | null = null;

export function getOfflineQueue(config?: QueueConfig): OfflineQueueManager {
  if (!queueInstance) {
    queueInstance = new OfflineQueueManager(config);
  }
  return queueInstance;
}

// React hooks for easy integration
import { useEffect, useState, useCallback } from 'react';

export function useOfflineQueue(config?: QueueConfig) {
  const [queue, setQueue] = useState<ReadonlyArray<QueueItem>>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queueSize, setQueueSize] = useState(0);
  const queueManager = getOfflineQueue(config);

  useEffect(() => {
    const updateState = () => {
      setQueue(queueManager.getQueue());
      setQueueSize(queueManager.getQueueSize());
      setIsOnline(queueManager.getOnlineStatus());
    };

    updateState();

    const unsubscribe = queueManager.subscribe((event) => {
      updateState();
    });

    return unsubscribe;
  }, [queueManager]);

  const enqueue = useCallback(<T = any>(
    type: string,
    method: QueueItem['method'],
    url: string,
    data?: T,
    options?: Parameters<typeof queueManager.enqueue>[4]
  ) => {
    return queueManager.enqueue(type, method, url, data, options);
  }, [queueManager]);

  const clearQueue = useCallback(() => {
    queueManager.clearQueue();
  }, [queueManager]);

  const removeItem = useCallback((id: string) => {
    return queueManager.removeItem(id);
  }, [queueManager]);

  return {
    queue,
    queueSize,
    isOnline,
    enqueue,
    clearQueue,
    removeItem
  };
}

// Utility function for skills sync specifically
export function queueSkillsSync(skills: any, athleteId: string) {
  const queue = getOfflineQueue();
  
  return queue.enqueue(
    'skills_sync',
    'PUT',
    `/api/athletes/${athleteId}/skills`,
    skills,
    {
      priority: 1,
      metadata: {
        athleteId,
        syncedAt: new Date().toISOString()
      }
    }
  );
}

export type { QueueItem, QueueConfig, QueueEvent, QueueEventType, QueueListener };
export { OfflineQueueManager };