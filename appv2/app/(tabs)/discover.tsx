import React, { useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useBluetoothP2P } from '../../components/BluetoothP2P';
import { useNetworkDiscovery } from '../../components/NetworkDiscovery';
import { useAppContext } from '../../context/AppContext';

export default function DiscoverTab() {
  const { contacts, setContacts } = useAppContext();
  const [mode, setMode] = useState<'BLE' | 'WiFi'>('BLE');
  const { devices: bleDevices, status, startScanning, stopScanning } = useBluetoothP2P();
  const { devices: wifiDevices } = useNetworkDiscovery('UserDevice');

  const devices = mode === 'BLE' ? bleDevices : wifiDevices;

  const saveContact = (device: any) => {
    if (!contacts.find((c) => c.id === device.id)) {
      setContacts([...contacts, { id: device.id, name: device.name, source: mode }]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Discover ({mode})</Text>
      <Button title={`Switch to ${mode === 'BLE' ? 'WiFi' : 'BLE'}`} onPress={() => setMode(mode === 'BLE' ? 'WiFi' : 'BLE')} />
      <Button title={mode === 'BLE' ? 'Start BLE Scan' : 'Start WiFi Discovery'} onPress={startScanning} />
      <Button title="Stop Scan" onPress={stopScanning} />
      <Text>Status: {status}</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#000' },
  device: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 5 },
  saveBtn: { backgroundColor: 'blue', padding: 8, borderRadius: 5 },
});
