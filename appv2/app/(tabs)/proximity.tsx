import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import { useBluetoothP2P } from '../../components/BluetoothP2P';
import { useNetworkDiscovery } from '../../components/NetworkDiscovery';

export default function ProximityIndicatorTab() {
  const { contacts, selectedContacts, setSelectedContacts } = useAppContext();
  const { devices: bleDevices } = useBluetoothP2P();
  const { devices: wifiDevices } = useNetworkDiscovery('UserDevice');

  // Check if any selected contact is in range (BLE or WiFi)
  const inRange = selectedContacts.some(
    (id) => bleDevices.find((d) => d.id === id) || wifiDevices.find((d) => d.id === id)
  );

  return (
    <View style={[styles.container, { backgroundColor: '#fff' }]}> 
      <Text style={[styles.header, { color: '#000' }]}>Proximity Indicator</Text>
      <View style={[styles.indicator, { backgroundColor: inRange ? 'green' : 'red' }]} />
      <Text style={{ color: '#000' }}>{inRange ? 'Contact in range' : 'No contacts in range'}</Text>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const selected = selectedContacts.includes(item.id);
          return (
            <TouchableOpacity
              style={[styles.contact, selected && styles.selected]}
              onPress={() => {
                setSelectedContacts((prev) =>
                  prev.includes(item.id)
                    ? prev.filter((id) => id !== item.id)
                    : [...prev, item.id]
                );
              }}
            >
              <Text style={{ color: selected ? 'white' : '#000' }}>{item.name || item.id}</Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={<Text style={{ color: '#000' }}>No contacts found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  indicator: { width: 100, height: 100, borderRadius: 50, alignSelf: 'center', margin: 20 },
  contact: { padding: 10, marginVertical: 5, borderRadius: 5, backgroundColor: '#eee' },
  selected: { backgroundColor: 'blue' },
});
