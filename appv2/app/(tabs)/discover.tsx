import React, { useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Switch, Alert } from 'react-native';
import { useBluetoothP2P } from '../../components/BluetoothP2P';
import { useNetworkDiscovery } from '../../components/NetworkDiscovery';
import { useAppContext } from '../../context/AppContext';

export default function DiscoverTab() {
  const { contacts, setContacts } = useAppContext();
  const [mode, setMode] = useState<'BLE' | 'WiFi'>('BLE');
  const [bleEnabled, setBleEnabled] = useState(true);
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const { devices: bleDevices, status, startScanning, stopScanning } = useBluetoothP2P();
  const { devices: wifiDevices } = useNetworkDiscovery('UserDevice', wifiEnabled);

  const devices = mode === 'BLE' ? bleDevices : wifiDevices;

  const saveContact = (device: any) => {
    if (!contacts.find((c) => c.id === device.id)) {
      setContacts([...contacts, { id: device.id, name: device.name, source: mode }]);
    }
  };

  const handleDebug = () => {
    Alert.alert('Debug Info', `BLE: ${bleEnabled}\nWi-Fi: ${wifiEnabled}\nBLE Devices: ${bleDevices.length}\nWi-Fi Devices: ${wifiDevices.length}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Networker</Text>
      <View style={styles.switchRow}>
        <View style={styles.switchCol}>
          <Text style={styles.label}>Bluetooth (BLE)</Text>
          <Switch value={bleEnabled} onValueChange={setBleEnabled} />
          <Text style={styles.statusText}>{bleEnabled ? (status === 'Scanning' ? 'Scanning for devices...' : status === 'Advertising' ? 'Broadcasting...' : status) : 'Disabled'}</Text>
        </View>
        <View style={styles.switchCol}>
          <Text style={styles.label}>Wi-Fi</Text>
          <Switch value={wifiEnabled} onValueChange={setWifiEnabled} />
          <Text style={styles.statusText}>{wifiEnabled ? 'Enabled' : 'Disabled'}</Text>
        </View>
        <TouchableOpacity style={styles.debugBtn} onPress={handleDebug}>
          <Text style={styles.debugBtnText}>Debug</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonRow}>
        <Button title={`Switch to ${mode === 'BLE' ? 'WiFi' : 'BLE'}`} onPress={() => setMode(mode === 'BLE' ? 'WiFi' : 'BLE')} />
        <Button title={mode === 'BLE' ? 'Start BLE Scan' : 'Start WiFi Discovery'} onPress={startScanning} />
        <Button title="Stop Scan" onPress={stopScanning} />
      </View>
      <Text style={styles.status}>Status: {status}</Text>
      <Text style={styles.subheader}>Discovered Devices</Text>
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.device}>
            <Text style={{ color: '#000' }}>{item.name || item.id}</Text>
            <TouchableOpacity onPress={() => saveContact(item)} style={styles.saveBtn}>
              <Text style={{ color: 'white' }}>Save</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: '#000' }}>No devices found.</Text>}
      />
      <Text style={styles.subheader}>Contacts</Text>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.device}>
            <Text style={{ color: '#000' }}>{item.name || item.id}</Text>
            <Text style={{ color: '#888' }}>{item.source}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: '#000' }}>No contacts saved.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#000', alignSelf: 'center' },
  subheader: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10, color: '#000' },
  status: { fontSize: 16, marginVertical: 10, color: '#333' },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  switchCol: { alignItems: 'center' },
  label: { fontSize: 14, color: '#333', marginBottom: 4 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  device: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 5 },
  saveBtn: { backgroundColor: 'blue', padding: 8, borderRadius: 5 },
  debugBtn: { backgroundColor: '#eee', padding: 8, borderRadius: 5, marginLeft: 10, minWidth: 60, alignItems: 'center' },
  debugBtnText: { color: '#333', fontWeight: 'bold', fontSize: 15 },
  statusText: { fontSize: 13, color: '#666', marginTop: 2, marginBottom: 2, minWidth: 90, textAlign: 'center' },
});
