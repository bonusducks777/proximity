import { useEffect, useState, useRef } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import { NativeEventEmitter, NativeModules } from 'react-native';
import { logger } from '../utils/LogUtil';
import BLEAdvertiser from 'react-native-ble-advertiser';
import type { Permission } from 'react-native';

const COMPANY_ID = 0x1234; // Use a consistent company ID for all devices
const SERVICE_UUID = '12345678-1234-5678-1234-567812345678';

export function useBluetoothP2P() {
  const [devices, setDevices] = useState<{ id: string; name: string; nickname?: string; lastSeen?: number; missedHeartbeats?: number; gray?: boolean }[]>([]);
  const [status, setStatus] = useState('Idle');
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState<any[]>([]);
  const [scanning, setScanning] = useState(false);
  const eventEmitter = useRef<NativeEventEmitter | null>(null);
  const deviceIds = useRef<Set<string>>(new Set());

  // Setup BLEAdvertiser event emitter
  useEffect(() => {
    if (Platform.OS === 'android') {
      BLEAdvertiser.setCompanyId(COMPANY_ID);
      eventEmitter.current = new NativeEventEmitter(NativeModules.BLEAdvertiser);
      const sub = eventEmitter.current.addListener('onDeviceFound', (device) => {
        // Prevent self-detection by comparing device.id to our own (if available)
        if (device && device.id && !deviceIds.current.has(device.id) && device.id !== NativeModules.BLEAdvertiser.getOwnAddress?.()) {
          deviceIds.current.add(device.id);
          setDevices(prev => {
            // If already exists, update lastSeen and nickname
            const idx = prev.findIndex(d => d.id === device.id);
            if (idx >= 0) {
              const updated = [...prev];
              updated[idx] = {
                ...updated[idx],
                lastSeen: Date.now(),
                nickname: device.deviceName || device.name || device.id
              };
              return updated;
            }
            // New device
            return [
              ...prev,
              {
                id: device.id,
                name: device.name || device.id,
                nickname: device.deviceName || device.name || device.id,
                lastSeen: Date.now()
              }
            ];
          });
        }
      });
      return () => sub.remove();
    }
  }, []);

  // Timeout logic for device disappearance (BLE and Wi-Fi)
  useEffect(() => {
    const interval = setInterval(() => {
      setDevices(prev => prev
        .map(d => {
          // If not seen in last 10s, remove
          if (d.lastSeen && Date.now() - d.lastSeen > 10000) return null;
          // If not seen in last 3*3s, increment missedHeartbeats
          const missed = d.lastSeen && Date.now() - d.lastSeen > 3000 ? (d.missedHeartbeats ?? 0) + 1 : 0;
          return {
            ...d,
            missedHeartbeats: missed,
            gray: missed >= 3 && (d.lastSeen && Date.now() - d.lastSeen < 10000) ? true : false
          };
        })
        .filter(d => d !== null)
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // When a device is seen, update its lastSeen timestamp and reset missedHeartbeats
  const markDeviceSeen = (id: string) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, lastSeen: Date.now(), missedHeartbeats: 0, gray: false } : d));
  };

  // Permission request helper for BLE (Android 12+)
  const requestBlePermissions = async () => {
    if (Platform.OS !== 'android') return true;
    const androidVersion = Platform.Version;
    let permissions: Permission[] = [];
    if (androidVersion >= 31) {
      permissions = [
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ];
    } else {
      permissions = [
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        'android.permission.BLUETOOTH' as Permission,
        'android.permission.BLUETOOTH_ADMIN' as Permission,
      ];
    }
    try {
      const granted = await PermissionsAndroid.requestMultiple(permissions);
      return Object.values(granted).every((status) => status === PermissionsAndroid.RESULTS.GRANTED);
    } catch (e) {
      logger.log('error', `BluetoothP2P: Permission request error: ${e}`);
      return false;
    }
  };

  // Start BLE advertising (Android only)
  const startAdvertising = async () => {
    if (Platform.OS !== 'android') {
      logger.log('bluetooth', 'BluetoothP2P: BLE advertising is only supported on Android');
      setStatus('Advertising not supported on this platform');
      return;
    }
    const hasPerm = await requestBlePermissions();
    if (!hasPerm) {
      setStatus('Advertising permission denied');
      logger.log('error', 'BluetoothP2P: BLE advertising permission denied');
      return;
    }
    if (!SERVICE_UUID) {
      setStatus('Advertising error: No service UUID');
      logger.log('error', 'BluetoothP2P: No service UUID provided');
      return;
    }
    try {
      logger.log('bluetooth', 'BluetoothP2P: Starting BLE advertising');
      setStatus('Advertising');
      await BLEAdvertiser.setCompanyId(COMPANY_ID);
      // Only advertise the service UUID, no manufacturer data or device name
      BLEAdvertiser.broadcast(
        SERVICE_UUID,
        [], // No manufacturer data
        {
          includeDeviceName: false, // Don't include device name to save space
          advertiseMode: 2, // ADVERTISE_MODE_LOW_LATENCY
          txPowerLevel: 3,  // ADVERTISE_TX_POWER_HIGH
          connectable: false,
        }
      )
        .then(success => logger.log('bluetooth', 'BluetoothP2P: Advertising started'))
        .catch(error => {
          logger.log('error', `BluetoothP2P: Advertising error: ${error}`);
          setStatus('Advertising error');
        });
    } catch (error) {
      logger.log('error', `BluetoothP2P: Failed to start advertising: ${error}`);
      setStatus('Advertising error');
    }
  };

  // Stop BLE advertising
  const stopAdvertising = () => {
    if (Platform.OS === 'android') {
      BLEAdvertiser.stopBroadcast()
        .then(() => logger.log('bluetooth', 'BluetoothP2P: Advertising stopped'))
        .catch(error => logger.log('error', `BluetoothP2P: Stop advertising error: ${error}`));
    }
  };

  // Start BLE scanning (Android only)
  const startScanning = async () => {
    if (Platform.OS !== 'android') {
      setStatus('Scanning not supported on this platform');
      return;
    }
    if (scanning) {
      logger.log('bluetooth', 'BluetoothP2P: Scan already in progress, skipping');
      return;
    }
    const hasPerm = await requestBlePermissions();
    if (!hasPerm) {
      setStatus('Scan permission denied');
      logger.log('error', 'BluetoothP2P: BLE scan permission denied');
      return;
    }
    if (!SERVICE_UUID) {
      setStatus('Scan error: No service UUID');
      logger.log('error', 'BluetoothP2P: No service UUID provided');
      return;
    }
    try {
      logger.log('bluetooth', 'BluetoothP2P: Starting BLE scan');
      setStatus('Scanning');
      setScanning(true);
      await BLEAdvertiser.setCompanyId(COMPANY_ID);
      // Use BLEAdvertiser.scan as in the official sample, not scanByService
      // Use null for manufacturer data filter (scan all devices)
      // Use scanMode: BLEAdvertiser.SCAN_MODE_LOW_LATENCY for low latency
      BLEAdvertiser.scan(
        null,
        { scanMode: BLEAdvertiser.SCAN_MODE_LOW_LATENCY }
      )
        .then(success => logger.log('bluetooth', 'BluetoothP2P: Scan started'))
        .catch(error => {
          logger.log('error', `BluetoothP2P: Scan error: ${error}`);
          setStatus('Scan error');
          setScanning(false);
        });
      // Filter discovered devices by service UUID in JS if needed
    } catch (error) {
      logger.log('error', `BluetoothP2P: Failed to start scanning: ${error}`);
      setStatus('Scan error');
      setScanning(false);
    }
  };

  // Stop BLE scanning
  const stopScanning = () => {
    if (Platform.OS === 'android') {
      if (!scanning) return;
      BLEAdvertiser.stopScan()
        .then(() => {
          logger.log('bluetooth', 'BluetoothP2P: Scan stopped');
          setScanning(false);
        })
        .catch(error => logger.log('error', `BluetoothP2P: Stop scan error: ${error}`));
      setStatus('Idle');
    }
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      logger.log('bluetooth', 'BluetoothP2P: Cleaning up BLE advertiser');
      stopScanning();
      stopAdvertising();
    };
  }, []);

  // Start advertising when scanning starts (for P2P discovery)
  useEffect(() => {
    if (status === 'Scanning') {
      startAdvertising();
    } else if (status === 'Idle') {
      stopAdvertising();
    }
  }, [status]);

  return {
    devices,
    status,
    message,
    setMessage,
    receivedMessages,
    startScanning,
    stopScanning,
    startAdvertising,
    stopAdvertising,
  };
}
