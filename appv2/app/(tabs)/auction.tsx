import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { useAppContext } from '../../context/AppContext';

export default function AuctionPickerTab() {
  const { contacts, selectedContacts, setSelectedContacts } = useAppContext();

  const toggle = (id: string) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: '#fff' }]}> 
      <Text style={[styles.header, { color: '#000' }]}>Auction Picker</Text>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isSelected = selectedContacts.includes(item.id);
          return (
            <TouchableOpacity
              style={[styles.contact, isSelected && styles.selected]}
              onPress={() => toggle(item.id)}
            >
              <Text style={{ color: isSelected ? 'white' : '#000' }}>{item.name || item.id}</Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={<Text style={{ color: '#000' }}>No contacts found.</Text>}
      />
      <Button title="Confirm Selection" onPress={() => console.log('Selected:', selectedContacts)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  contact: { padding: 10, marginVertical: 5, borderRadius: 5, backgroundColor: '#eee' },
  selected: { backgroundColor: 'green' },
});
