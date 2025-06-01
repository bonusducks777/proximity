import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, Platform, Linking, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useBluetoothP2P } from '../../components/BluetoothP2P';
import { useNetworkDiscovery } from '../../components/NetworkDiscovery';
import { logger } from '../../utils/LogUtil';
import { PermissionDebugUtil } from '../../utils/PermissionDebugUtil';
import * as Network from 'expo-network';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { useAppContext } from '../../context/AppContext';

export default function TroubleshootingTab() {
  // Get BLE and WiFi states from global context
  const { bleEnabled, setBleEnabled, wifiEnabled, setWifiEnabled, contacts } = useAppContext();

  // Bluetooth hook usage
  const { devices, status, startScanning, stopScanning } = useBluetoothP2P();
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const networkDeviceName = Device.deviceName || 'UnknownDevice';
  const { devices: wifiDevices, wifiAvailable, testMulticastConnectivity } = useNetworkDiscovery(networkDeviceName, wifiEnabled);
  // Handle Bluetooth scanning toggle (using global state)
  const toggleScanning = async () => {
    if (isScanning) {
      logger.log('bluetooth', 'TroubleshootingTab: Stopping BLE scan');
      stopScanning();
      setIsScanning(false);
      setBleEnabled(false); // Update global state
    } else {
      logger.log('bluetooth', 'TroubleshootingTab: Starting BLE scan');
      try {
        await startScanning();
        setIsScanning(true);
        setBleEnabled(true); // Update global state
        setError(null);
      } catch (e) {
        const errorMsg = e instanceof Error ? e.message : String(e);
        setError(`Error: ${errorMsg}`);
        logger.log('error', `TroubleshootingTab: BLE scan error - ${errorMsg}`);
        
        // Show alert with helpful instructions
        Alert.alert(
          'Bluetooth Error',
          `Could not start Bluetooth scanning: ${errorMsg}\n\nPlease make sure Bluetooth is turned on and permissions are granted.`,
          [
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
            { text: 'OK', style: 'cancel' }
          ]
        );
      }
    }
  };  // Update scan status based on BLE status changes and global state
  useEffect(() => {
    if (status.toLowerCase().includes('off') || status.toLowerCase().includes('denied')) {
      setIsScanning(false);
      if (bleEnabled) {
        setBleEnabled(false); // Update global state if BLE is turned off
      }
    } else if (status.toLowerCase() === 'poweredon') {
      // Sync with global state
      if (bleEnabled && !isScanning) {
        // If global state is enabled but we're not scanning, start scanning
        logger.log('bluetooth', 'TroubleshootingTab: Syncing with global BLE state (on)');
        startScanning().catch(e => {
          const errorMsg = e instanceof Error ? e.message : String(e);
          setError(`Error: ${errorMsg}`);
        });
        setIsScanning(true);
      } else if (!bleEnabled && isScanning) {
        // If global state is disabled but we're scanning, stop scanning
        logger.log('bluetooth', 'TroubleshootingTab: Syncing with global BLE state (off)');
        stopScanning();
        setIsScanning(false);
      }
    }
  }, [status, bleEnabled]);
  
  // Get network state
  const [networkInfo, setNetworkInfo] = useState<{
    ipAddress: string | null;
    networkType: string | null;
    isConnected: boolean | null;
  }>({
    ipAddress: null,
    networkType: null,
    isConnected: null,
  });
  
  // Get device info
  const [deviceInfo, setDeviceInfo] = useState<{
    deviceName: string | null;
    osVersion: string | null;
    deviceType: string | null;
  }>({
    deviceName: null,
    osVersion: null,
    deviceType: null,
  });
  
  // App version
  const appVersion = Constants.expoConfig?.version || 'Unknown';
    // Fetch device and network info
  useEffect(() => {
    async function getInfo() {
      try {
        // Network info
        const networkType = await Network.getNetworkStateAsync();
        const ipAddress = await Network.getIpAddressAsync();
        
        setNetworkInfo({
          ipAddress: ipAddress || null,
          networkType: networkType?.type || null,
          isConnected: networkType?.isConnected || false,
        });
        
        // Device info
        const deviceName = Device.deviceName || 'Unknown device';
        const osVersion = `${Device.osName} ${Device.osVersion}`;
        const deviceType = Device.deviceType === Device.DeviceType.PHONE ? 'Phone' : 
                           Device.deviceType === Device.DeviceType.TABLET ? 'Tablet' : 'Unknown';
        
        setDeviceInfo({
          deviceName,
          osVersion,
          deviceType,
        });
      } catch (err) {
        logger.log('error', `Failed to get network/device info: ${err}`);
      }
    }
    
    getInfo();
  }, []);
  
  // Periodically update Bluetooth status
  useEffect(() => {
    const interval = setInterval(() => {
      if (isScanning) {
        logger.log('bluetooth', 'Periodic status check while scanning');
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isScanning]);
  
  // Get the logs from logger
  const [logs, setLogs] = useState<any[]>([]);
  useEffect(() => {
    // Update logs every second
    const interval = setInterval(() => {
      setLogs(logger.getLogs().slice(0, 100)); // Get the most recent 100 logs
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Troubleshooting</Text>
      
      {/* Device Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Device Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Device:</Text>
          <Text style={styles.infoValue}>{deviceInfo.deviceName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>OS:</Text>
          <Text style={styles.infoValue}>{deviceInfo.osVersion}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Device Type:</Text>
          <Text style={styles.infoValue}>{deviceInfo.deviceType}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>App Version:</Text>
          <Text style={styles.infoValue}>{appVersion}</Text>
        </View>
      </View>
      
      {/* Network Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Network Status</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Connected:</Text>
          <Text style={styles.infoValue}>
            {networkInfo.isConnected === null ? 'Checking...' : 
             networkInfo.isConnected ? 'Yes' : 'No'}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Type:</Text>
          <Text style={styles.infoValue}>{networkInfo.networkType || 'Unknown'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>IP Address:</Text>
          <Text style={styles.infoValue}>{networkInfo.ipAddress || 'Unknown'}</Text>
        </View>
      </View>
      
      {/* Connectivity Controls */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connectivity Controls</Text>
        
        {/* Bluetooth */}
        <Text style={styles.subSectionTitle}>Bluetooth</Text>
        <Text style={styles.statusText}>Status: {status}</Text>
        {error && <Text style={styles.error}>{error}</Text>}
        <View style={styles.controlRow}>
          <Text>BLE Scanner:</Text>          <Switch 
            value={bleEnabled} // Use global state for consistency
            onValueChange={toggleScanning}
            disabled={status.toLowerCase().includes('off') || status.toLowerCase().includes('denied')}
          />
        </View>
        <Text style={styles.subtitle}>Discovered BLE Devices: {devices.length}</Text>
        {devices.length > 0 && (
          <FlatList
            data={devices}
            style={styles.miniList}
            nestedScrollEnabled
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.deviceItem}>
                <Text style={styles.deviceName} numberOfLines={1} ellipsizeMode="tail">{item.name || 'Unknown Device'}</Text>
                <Text style={styles.deviceId} numberOfLines={1} ellipsizeMode="middle">ID: {item.id}</Text>
              </View>
            )}
          />
        )}        {/* Wi-Fi */}
        <Text style={styles.subSectionTitle}>Wi-Fi</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>System Wi-Fi:</Text>
          <Text style={styles.infoValue}>{networkInfo.isConnected ? "Connected" : "Disconnected"}</Text>
        </View>
        <View style={styles.controlRow}>
          <Text>Wi-Fi Discovery:</Text>          <Switch 
            value={wifiEnabled} 
            onValueChange={(value) => {
              setWifiEnabled(value); // This now uses the global context's setWifiEnabled
              logger.log('wifi', `TroubleshootingTab: Wi-Fi discovery ${value ? 'enabled' : 'disabled'}`);
            }}
            disabled={false} // Never disable this toggle - let user control it
          />
        </View>
        <Text style={styles.subtitle}>Discovered Wi-Fi Devices: {wifiDevices.length}</Text>
        {wifiDevices.length > 0 && (
          <FlatList
            data={wifiDevices}
            style={styles.miniList}
            nestedScrollEnabled
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.deviceItem}>
                <Text style={styles.deviceName} numberOfLines={1} ellipsizeMode="tail">{item.name || 'Unknown Device'}</Text>
                <Text style={styles.deviceId} numberOfLines={1} ellipsizeMode="middle">ID: {item.id}</Text>
              </View>
            )}
          />
        )}
      </View>
      
      {/* Diagnostics Tools */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Diagnostic Tools</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.diagButton}
            onPress={async () => {
              try {
                const report = await PermissionDebugUtil.getPermissionReport();
                logger.log('info', `Permission report generated: ${report}`);
                Alert.alert('Permission Status', report, [{ text: 'OK' }], { cancelable: true });
              } catch (e) {
                const errorMsg = e instanceof Error ? e.message : String(e);
                logger.log('error', `Failed to get permission report: ${errorMsg}`);
                Alert.alert('Error', `Failed to check permissions: ${errorMsg}`);
              }
            }}
          >
            <Text style={styles.diagButtonText}>Check Permissions</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.diagButton}
            onPress={() => {
              Linking.openSettings();
            }}
          >
            <Text style={styles.diagButtonText}>Open Settings</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.diagButton}
            onPress={async () => {
              if (!wifiEnabled) {
                Alert.alert('Wi-Fi Test', 'Please enable Wi-Fi discovery first');
                return;
              }
              
              logger.log('wifi', 'TroubleshootingTab: Testing Wi-Fi multicast connectivity');
              
              // First show that we're testing
              Alert.alert('Wi-Fi Test', 'Testing multicast connectivity... Please wait.');
              
              // Run the test
              const testId = testMulticastConnectivity();
              
              if (!testId) {
                Alert.alert(
                  'Wi-Fi Test Failed', 
                  'Failed to send test message.\n\nPossible issues:\n' + 
                  '- Wi-Fi might be disconnected\n' + 
                  '- The connection might be unstable\n' +
                  '- There might be network restrictions\n\n' +
                  'Try connecting to a different Wi-Fi network or creating a hotspot from another device.'
                );
                return;
              }
              
              // Set a timer to check if we received our own message
              setTimeout(() => {
                const found = wifiDevices.some(d => {
                  try {
                    return d.id === testId;
                  } catch {
                    return false;
                  }
                });
                
                if (found) {
                  Alert.alert(
                    'Wi-Fi Test Successful', 
                    'Multicast is working! Your device can see its own messages.\n\n' +
                    'Other devices should be able to discover this device.'
                  );
                } else {
                  Alert.alert(
                    'Wi-Fi Test Failed',
                    'Multicast test failed. Your device sent messages but could not receive them.\n\n' +
                    'Possible issues:\n' +
                    '- Network blocks multicast traffic\n' +
                    '- The router has AP isolation enabled\n' +
                    '- This device does not support multicast\n\n' +
                    'Try these solutions:\n' +
                    '1. Connect to a different Wi-Fi network\n' +
                    '2. Create a mobile hotspot from another device\n' +
                    '3. Check if any VPN is active and disable it',
                    [
                      { text: 'Open Wi-Fi Settings', onPress: () => Linking.openSettings() },
                      { text: 'OK', style: 'cancel' }
                    ]
                  );
                }
              }, 3000); // Wait 3 seconds for our message
            }}
          >
            <Text style={styles.diagButtonText}>Test Wi-Fi</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.diagButton}
            onPress={() => {
              logger.log('info', 'User cleared logs');
              logger.clearLogs();
              setLogs([]);
              Alert.alert('Success', 'Logs have been cleared');
            }}
          >
            <Text style={styles.diagButtonText}>Clear Logs</Text>
          </TouchableOpacity>
        </View>
      </View>      {/* App Logs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Logs</Text>
        <View style={styles.logContainer}>
          <ScrollView>
            {logs.map((log, index) => (
              <View key={index} style={{ flexDirection: 'row', width: '100%' }}>
                <View style={{ width: '100%' }}>
                  <Text 
                    style={[
                      styles.logEntry, 
                      log.type === 'error' && styles.errorLog,
                      log.type === 'bluetooth' && styles.bleLog,
                      log.type === 'wifi' && styles.wifiLog,
                    ]}
                    adjustsFontSizeToFit={false}
                  >
                    <Text style={{ fontWeight: 'bold' }}>
                      [{new Date(log.timestamp).toLocaleTimeString()}] 
                    </Text>
                    <Text style={{ fontStyle: 'italic' }}>
                      [{log.type}]
                    </Text>
                    {' '}{log.message}
                  </Text>
                </View>
              </View>
            ))}
            {logs.length === 0 && (
              <Text style={styles.emptyMessage}>No logs to display</Text>
            )}
          </ScrollView>
        </View>
      </View>
    </ScrollView>  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: 'bold',
    width: 100,
  },
  infoValue: {
    flex: 1,
  },
  statusText: {
    fontSize: 14,
    marginBottom: 8,
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 'bold', 
    marginTop: 12,
    marginBottom: 8,
  },
  miniList: {
    maxHeight: 150,
    marginBottom: 8,
  },  deviceItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    width: '100%',
  },
  deviceName: {
    fontSize: 14,
    fontWeight: 'bold',
    flexShrink: 1,
    width: '100%',
  },
  deviceId: {
    fontSize: 12,
    color: '#666',
    flexShrink: 1,
    width: '100%',
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontStyle: 'italic',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 8,
  },
  diagButton: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    minWidth: '45%',
    alignItems: 'center',
  },
  diagButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
  },  logContainer: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 5,
    maxHeight: 300,
    width: '100%',
    marginBottom: 20,
  },  logEntry: {
    fontSize: 9,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 6,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    width: '100%',
    flexWrap: 'wrap',
  },
  errorLog: {
    color: '#d32f2f',
  },
  bleLog: {
    color: '#1976d2',
  },
  wifiLog: {
    color: '#388e3c',
  },
});
