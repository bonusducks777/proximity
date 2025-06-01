import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useAppContext } from '../../context/AppContext';
import Proximity from './proximity';

const MOCK_URL = 'https://preview--prox-fusion-wallet-verse.lovable.app';

export default function ProximityTabWrapper() {
  const { mockMode } = useAppContext();
  if (mockMode.proximity) {
    console.log('[DEBUG] Showing Proximity mock overlay');
    return (
      <View style={styles.container}>
        <Text style={{position:'absolute',top:0,left:0,zIndex:10,backgroundColor:'yellow'}}>[DEBUG] MOCK OVERLAY</Text>
        <WebView source={{ uri: MOCK_URL }} style={styles.webview} />
      </View>
    );
  }
  console.log('[DEBUG] Showing Proximity real screen');
  return (
    <View style={styles.container}>
      <Text style={{position:'absolute',top:0,left:0,zIndex:10,backgroundColor:'yellow'}}>[DEBUG] REAL SCREEN</Text>
      <Proximity />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
});
