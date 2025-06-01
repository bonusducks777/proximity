import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert, Platform, Linking, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useBluetoothP2P } from '../../components/BluetoothP2P';
import { logger } from '../../utils/LogUtil';
import { PermissionDebugUtil } from '../../utils/PermissionDebugUtil';
import * as Network from 'expo-network';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

export default function TroubleshootingTab() {
  // Example usage of the hook
  const { devices, status, startScanning, stopScanning } = useBluetoothP2P();
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Handle scanning toggle
  const toggleScanning = async () => {
    if (isScanning) {
      logger.log('bluetooth', 'TroubleshootingTab: Stopping scan');
      stopScanning();
      setIsScanning(false);
    } else {
      logger.log('bluetooth', 'TroubleshootingTab: Starting scan');
      try {
        await startScanning();
        setIsScanning(true);
        setError(null);
      } catch (e) {
        const errorMsg = e instanceof Error ? e.message : String(e);
        setError(`Error: ${errorMsg}`);
        logger.log('error', `TroubleshootingTab: Scan error - ${errorMsg}`);
        
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
  };

  // Update scan status based on BLE status changes
  useEffect(() => {
    if (status.toLowerCase().includes('off') || status.toLowerCase().includes('denied')) {
      setIsScanning(false);
    }
  }, [status]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bluetooth Scanner</Text>
      <Text style={styles.statusText}>Status: {status}</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <View style={styles.controlRow}>
        <Text>Enable Scanning</Text>
        <Switch 
          value={isScanning} 
          onValueChange={toggleScanning}
          disabled={status.toLowerCase().includes('off') || status.toLowerCase().includes('denied')}
        />
      </View>
      
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

      <Text style={styles.subtitle}>Discovered Devices: {devices.length}</Text>
      <FlatList
        data={devices}
        style={styles.list}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.deviceItem}>
            <Text style={styles.deviceName}>{item.name || 'Unknown Device'}</Text>
            <Text style={styles.deviceId}>ID: {item.id}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>
            {isScanning ? 'Searching for devices...' : 'Turn on scanning to discover devices'}
          </Text>
        }
      />
    </View>  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold', 
    marginTop: 20,
    marginBottom: 10,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  list: {
    flex: 1,
  },
  deviceItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deviceId: {
    fontSize: 14,
    color: '#666',
  },  emptyMessage: {
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
  diagButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  diagButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
