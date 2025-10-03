interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  context?: any;
  userAgent?: string;
  url?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private createLogEntry(level: LogEntry['level'], message: string, context?: any): LogEntry {
    return {
      timestamp: this.formatTimestamp(),
      level,
      message,
      context,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server',
      url: typeof window !== 'undefined' ? window.location.href : 'Server'
    };
  }

  private async saveToLocalStorage(entry: LogEntry) {
    if (typeof window === 'undefined') return;
    
    try {
      const logs = JSON.parse(localStorage.getItem('app_logs') || '[]');
      logs.push(entry);
      
      // Keep only last 100 logs
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }
      
      localStorage.setItem('app_logs', JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to save log to localStorage:', error);
    }
  }

  private async sendToServer(entry: LogEntry) {
    if (typeof window === 'undefined') return;
    
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
    } catch (error) {
      // Silently fail for server logging to avoid infinite loops
    }
  }

  private log(level: LogEntry['level'], message: string, context?: any) {
    const entry = this.createLogEntry(level, message, context);
    
    // Always log to console in development
    if (this.isDevelopment && typeof console !== 'undefined') {
      try {
        const logMessage = `[${entry.timestamp}] ${level}: ${message}`;
        const contextData = context || '';
        
        switch (level) {
          case 'ERROR':
            console.error(logMessage, contextData);
            break;
          case 'WARN':
            console.warn(logMessage, contextData);
            break;
          case 'DEBUG':
            console.debug(logMessage, contextData);
            break;
          default:
            console.log(logMessage, contextData);
            break;
        }
      } catch (error) {
        // Fallback to simple console.log if there's any issue
        console.log(`[${entry.timestamp}] ${level}: ${message}`);
      }
    }
    
    // Save to localStorage
    this.saveToLocalStorage(entry);
    
    // Send to server for ERROR and WARN levels
    if (level === 'ERROR' || level === 'WARN') {
      this.sendToServer(entry);
    }
  }

  info(message: string, context?: any) {
    this.log('INFO', message, context);
  }

  warn(message: string, context?: any) {
    this.log('WARN', message, context);
  }

  error(message: string, context?: any) {
    this.log('ERROR', message, context);
  }

  debug(message: string, context?: any) {
    this.log('DEBUG', message, context);
  }

  // Try-on specific logging methods
  tryOnStarted(productId: string, userId?: string) {
    this.info('Try-on session started', { productId, userId, action: 'try_on_start' });
  }

  tryOnImageUploaded(productId: string, imageSize: number) {
    this.info('Customer image uploaded', { productId, imageSize, action: 'image_upload' });
  }

  tryOnVisualizationStarted(productId: string) {
    this.info('Visualization started', { productId, action: 'visualization_start' });
  }

  tryOnVisualizationCompleted(productId: string, processingTime: number) {
    this.info('Visualization completed', { productId, processingTime, action: 'visualization_complete' });
  }

  tryOnVisualizationFailed(productId: string, error: string) {
    this.error('Visualization failed', { productId, error, action: 'visualization_error' });
  }

  // API related logging
  apiRequest(endpoint: string, method: string, data?: any) {
    this.debug('API request', { endpoint, method, data });
  }

  apiResponse(endpoint: string, status: number, responseTime: number) {
    this.debug('API response', { endpoint, status, responseTime });
  }

  apiError(endpoint: string, error: string, status?: number) {
    this.error('API error', { endpoint, error, status });
  }

  // Get logs for debugging
  getLogs(): LogEntry[] {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem('app_logs') || '[]');
    } catch {
      return [];
    }
  }

  // Clear logs
  clearLogs() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('app_logs');
  }
}

// Export singleton instance
export const logger = new Logger();
