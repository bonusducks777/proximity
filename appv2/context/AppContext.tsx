import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '../utils/LogUtil';

export type Contact = { 
  id: string; 
  name: string; 
  source: 'BLE' | 'WiFi';
  online?: boolean;
  lastSeen?: number;
  missedHeartbeats?: number;
  gray?: boolean;
};

interface AppContextType {
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  selectedContacts: string[];
  setSelectedContacts: React.Dispatch<React.SetStateAction<string[]>>;
  username: string;
  setUsername: (name: string) => void;
  logs: any[];
  addContact: (contact: Contact) => void;
  updateContactStatus: (id: string, online: boolean) => void;
  // Added global BLE and WiFi state
  bleEnabled: boolean;
  setBleEnabled: (enabled: boolean) => void;
  wifiEnabled: boolean;
  setWifiEnabled: (enabled: boolean) => void;
  mockMode: { discover: boolean; proximity: boolean; auction: boolean };
  setMockMode: React.Dispatch<React.SetStateAction<{ discover: boolean; proximity: boolean; auction: boolean }>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [username, setUsernameState] = useState<string>('');
  const [logs, setLogs] = useState<any[]>([]);
  // Add shared BLE and WiFi state
  const [bleEnabled, setBleEnabledState] = useState<boolean>(false);
  const [wifiEnabled, setWifiEnabledState] = useState<boolean>(false);
  const [mockMode, setMockMode] = useState<{ discover: boolean; proximity: boolean; auction: boolean }>({
    discover: false,
    proximity: false,
    auction: false,
  });
  
  // Initialize logger and load saved data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Initialize logger first
        await logger.initialize();
        
        // Load username from storage
        const savedUsername = await AsyncStorage.getItem('USERNAME');
        if (savedUsername) {
          setUsernameState(savedUsername);
          logger.setUsername(savedUsername);
        }

        // Load saved contacts
        const savedContacts = await AsyncStorage.getItem('CONTACTS');
        if (savedContacts) {
          setContacts(JSON.parse(savedContacts));
          logger.log('info', `Loaded ${JSON.parse(savedContacts).length} saved contacts`);
        }

        // Load saved BLE and WiFi states
        const savedBleEnabled = await AsyncStorage.getItem('BLE_ENABLED');
        if (savedBleEnabled) {
          setBleEnabledState(savedBleEnabled === 'true');
        }

        const savedWifiEnabled = await AsyncStorage.getItem('WIFI_ENABLED');
        if (savedWifiEnabled) {
          setWifiEnabledState(savedWifiEnabled === 'true');
        }

        // Load saved mock mode
        const savedMockMode = await AsyncStorage.getItem('MOCK_MODE');
        if (savedMockMode) {
          setMockMode(JSON.parse(savedMockMode));
        }
      } catch (error) {
        console.error('Failed to load data from storage:', error);
      }
    };

    loadData();
    
    // Set up interval to check for offline contacts
    const interval = setInterval(() => {
      const now = Date.now();
      const timeoutThreshold = 15000; // 15 seconds offline threshold
      
      setContacts(prevContacts => {
        const updatedContacts = prevContacts.map(contact => {
          if (contact.lastSeen && now - contact.lastSeen > timeoutThreshold && contact.online) {
            // Mark as offline if last seen > threshold
            logger.log('info', `Contact ${contact.name} (${contact.id}) is now offline (timeout)`);
            return { ...contact, online: false };
          }
          return contact;
        });
        
        // Only update if there was a change
        if (JSON.stringify(prevContacts) !== JSON.stringify(updatedContacts)) {
          // Save updated contacts
          AsyncStorage.setItem('CONTACTS', JSON.stringify(updatedContacts))
            .catch(err => console.error('Failed to save contacts:', err));
          return updatedContacts;
        }
        return prevContacts;
      });
    }, 5000); // Check every 5 seconds
    
    // Update logs from logger periodically
    const logsInterval = setInterval(() => {
      setLogs(logger.getLogs());
    }, 1000);
    
    return () => {
      clearInterval(interval);
      clearInterval(logsInterval);
    };
  }, []);

  // Save contacts whenever they change
  useEffect(() => {
    AsyncStorage.setItem('CONTACTS', JSON.stringify(contacts))
      .catch(err => console.error('Failed to save contacts:', err));
  }, [contacts]);

  // Update username with persistence
  const setUsername = (name: string) => {
    logger.log('info', `Username changed to: ${name}`);
    logger.setUsername(name);
    setUsernameState(name);
    AsyncStorage.setItem('USERNAME', name).catch(err => {
      console.error('Failed to save username:', err);
    });
  };

  // Update BLE state with persistence
  const setBleEnabled = (enabled: boolean) => {
    logger.log('bluetooth', `BLE discovery ${enabled ? 'enabled' : 'disabled'} globally`);
    setBleEnabledState(enabled);
    AsyncStorage.setItem('BLE_ENABLED', String(enabled)).catch(err => {
      console.error('Failed to save BLE state:', err);
    });
  };

  // Update WiFi state with persistence
  const setWifiEnabled = (enabled: boolean) => {
    logger.log('wifi', `WiFi discovery ${enabled ? 'enabled' : 'disabled'} globally`);
    setWifiEnabledState(enabled);
    AsyncStorage.setItem('WIFI_ENABLED', String(enabled)).catch(err => {
      console.error('Failed to save WiFi state:', err);
    });
  };

  // Persist mockMode state to AsyncStorage
  useEffect(() => {
    AsyncStorage.setItem('MOCK_MODE', JSON.stringify(mockMode)).catch(err => {
      console.error('Failed to save mock mode:', err);
    });
  }, [mockMode]);

  // Add or update a contact
  const addContact = (contact: Contact) => {
    setContacts(prev => {
      // Check if contact already exists
      const exists = prev.some(c => c.id === contact.id);
      if (exists) {
        logger.log('info', `Contact ${contact.name} (${contact.id}) already exists, updating status`);
        return prev.map(c => 
          c.id === contact.id 
            ? { ...c, online: true, lastSeen: Date.now() } 
            : c
        );
      } else {
        // Add new contact with current timestamp
        logger.log('info', `Added new contact: ${contact.name} (${contact.id})`);
        return [...prev, { ...contact, online: true, lastSeen: Date.now() }];
      }
    });
  };

  // Update a contact's online status
  const updateContactStatus = (id: string, online: boolean) => {
    setContacts(prevContacts => 
      prevContacts.map(contact => {
        if (contact.id === id && contact.online !== online) {
          logger.log('info', `Contact ${contact.name} (${id}) is now ${online ? 'online' : 'offline'}`);
          return { 
            ...contact, 
            online, 
            lastSeen: online ? Date.now() : contact.lastSeen 
          };
        }
        return contact;
      })
    );
  };

  // Mark contacts as online/offline based on actual device presence
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const timeoutThreshold = 15000; // 15 seconds offline threshold
      setContacts(prevContacts => {
        return prevContacts.map(contact => {
          // Only mark offline if lastSeen is too old and currently online
          if (contact.lastSeen && now - contact.lastSeen > timeoutThreshold && contact.online) {
            logger.log('info', `Contact ${contact.name} (${contact.id}) is now offline (timeout)`);
            return { ...contact, online: false };
          }
          // Only mark online if lastSeen is recent and currently offline
          if (contact.lastSeen && now - contact.lastSeen <= timeoutThreshold && !contact.online) {
            // Only set online if the device is actually present in the current device list
            // (This requires the device discovery logic to update lastSeen only when device is seen)
            logger.log('info', `Contact ${contact.name} (${contact.id}) is now online (seen)`);
            return { ...contact, online: true };
          }
          return contact;
        });
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppContext.Provider
      value={{
        contacts,
        setContacts,
        selectedContacts,
        setSelectedContacts,
        username,
        setUsername,
        logs,
        addContact,
        updateContactStatus,
        // New shared BLE and WiFi states
        bleEnabled,
        setBleEnabled,
        wifiEnabled,
        setWifiEnabled,
        mockMode,
        setMockMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
