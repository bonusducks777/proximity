// LogUtil.ts - Utility for logging app events
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LogEntry {
  timestamp: number;
  type: 'info' | 'error' | 'bluetooth' | 'wifi' | 'ui' | 'scanning';
  message: string;
  username: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private username = 'Unknown';
  private static instance: Logger;
  private maxLogs = 1000; // Limit to prevent memory issues

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public async initialize(): Promise<void> {
    try {
      const storedUsername = await AsyncStorage.getItem('USERNAME');
      if (storedUsername) {
        this.username = storedUsername;
      }

      const storedLogs = await AsyncStorage.getItem('APP_LOGS');
      if (storedLogs) {
        this.logs = JSON.parse(storedLogs);
      }
    } catch (error) {
      console.error('Failed to load logs:', error);
    }
  }

  public setUsername(name: string): void {
    this.username = name;
    AsyncStorage.setItem('USERNAME', name).catch(err => 
      console.error('Failed to save username:', err)
    );
  }

  public getUsername(): string {
    return this.username;
  }

  public log(type: LogEntry['type'], message: string): void {
    const entry: LogEntry = {
      timestamp: Date.now(),
      type,
      message,
      username: this.username,
    };
    
    this.logs.unshift(entry); // Add to beginning for most recent first
    
    // Limit logs to prevent memory issues
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
    
    // Log to console
    console.log(`[${entry.type.toUpperCase()}][${entry.username}] ${message}`);
    
    // Save logs periodically (throttle to avoid excessive writes)
    this.saveLogs();
  }
  private saveLogs = (() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        AsyncStorage.setItem('APP_LOGS', JSON.stringify(this.logs))
          .catch(err => console.error('Failed to save logs:', err));
        timeoutId = null;
      }, 5000); // Save after 5 seconds of inactivity
    };
  })();

  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  public clearLogs(): void {
    this.logs = [];
    AsyncStorage.removeItem('APP_LOGS').catch(err => 
      console.error('Failed to clear logs:', err)
    );
  }
}

export const logger = Logger.getInstance();
