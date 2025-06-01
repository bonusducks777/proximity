import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TextInput, Platform, StyleSheet } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { PermissionsAndroid } from 'react-native';

const bleManager = new BleManager();
const SERVICE_UUID = '12345678-1234-5678-1234-567812345678';
const CHARACTERISTIC_UUID = '87654321-4321-8765-4321-876543210987';

const BluetoothP2P = () => {
  const [devices, setDevices] = useState([]);
  const [status, setStatus] = useState('Idle');
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]);

  // Request Bluetooth permissions
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
      return Object.values(granted).every((status) => status === PermissionsAndroid.RESULTS.GRANTED);
    }
    return true; // iOS handles permissions via Info.plist
  };

  // Start scanning for nearby devices
  const startScanning = async () => {
    const permissionGranted = await requestPermissions();
    if (!permissionGranted) {
      setStatus('Permissions denied');
      return;
    }

    setStatus('Scanning');
    bleManager.startDeviceScan([SERVICE_UUID], null, (error, device) => {
      if (error) {
        setStatus('Scan error: ' + error.message);
        return;
      }
      if (device && device.name && !devices.find((d) => d.id === device.id)) {
        setDevices((prev) => [...prev, device]);
      }
    });
  };

  // Advertise as a peripheral (simplified, requires native tweaks)
  const startAdvertising = async () => {
    setStatus('Advertising');
    // Note: react-native-ble-plx doesn't fully support advertising on iOS without native code
    // For prototype, assume one device scans and another connects
  };

  // Send a message to a device
  const sendMessage = async (deviceId, message) => {
    try {
      setStatus('Connecting to ' + deviceId);
      const device = await bleManager.connectToDevice(deviceId);
      await device.discoverAllServicesAndCharacteristics();
      await device.writeCharacteristicForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        Buffer.from(message).toString('base64')
      );
      setStatus('Message sent to ' + deviceId);
    } catch (error) {
      setStatus('Error sending message: ' + error.message);
    }
  };

  // Listen for incoming messages
  const listenForMessages = async (deviceId) => {
    try {
      const device = await bleManager.connectToDevice(deviceId);
      await device.discoverAllServicesAndCharacteristics();
      await device.monitorCharacteristicForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) {
            setStatus('Monitor error: ' + error.message);
            return;
          }
          const message = Buffer.from(characteristic.value, 'base64').toString();
          setReceivedMessages((prev) => [...prev, { id: deviceId, message }]);
        }
      );
    } catch (error) {
      setStatus('Error listening: ' + error.message);
    }
  };

  useEffect(() => {
    startScanning();
    // Optionally start advertising (requires native setup for iOS)
    return () => {
      bleManager.stopDeviceScan();
      bleManager.destroy();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.status}>Status: {status}</Text>
      <Text style={styles.header}>Nearby Devices:</Text>
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.device}>
            <Text>{item.name || item.id}</Text>
            <Button
              title="Send Message"
              onPress={() => sendMessage(item.id, message || 'Hello!')}
            />
            <Button title="Listen" onPress={() => listenForMessages(item.id)} />
          </View>
        )}
      />
      <Text style={styles.header}>Messages:</Text>
      <FlatList
        data={receivedMessages}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <Text>{`From ${item.id}: ${item.message}`}</Text>
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter message"
        value={message}
        onChangeText={setMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  status: { fontSize: 16, marginBottom: 10 },
  header: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  device: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 },
  input: { borderWidth: 1, padding: 10, marginTop: 10 },
});

export default BluetoothP2P;