import React from 'react';
import { View, Text, Switch } from 'react-native';
import Web3ModalConnect from '../../components/Web3ModalConnect';
import { useAppContext } from '../../context/AppContext';

export default function WalletTab() {
  // Use global BLE and WiFi state
  const { bleEnabled, setBleEnabled, wifiEnabled, setWifiEnabled } = useAppContext();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Web3ModalConnect />
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Text style={{ marginRight: 10 }}>BLE</Text>
        <Switch value={bleEnabled} onValueChange={setBleEnabled} />
        <Text style={{ marginHorizontal: 20 }}>Wi-Fi</Text>
        <Switch value={wifiEnabled} onValueChange={setWifiEnabled} />
      </View>
    </View>
  );
}
