import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useAppContext } from '../../context/AppContext';
import Auction from './auction';

const MOCK_URL = 'https://preview--crypto-proximity-bid.lovable.app';

export default function AuctionTabWrapper() {
  const { mockMode } = useAppContext();
  if (mockMode.auction) {
    console.log('[DEBUG] Showing Auction mock overlay');
    return (
      <View style={styles.container}>
        <Text style={{position:'absolute',top:0,left:0,zIndex:10,backgroundColor:'yellow'}}>[DEBUG] MOCK OVERLAY</Text>
        <WebView source={{ uri: MOCK_URL }} style={styles.webview} />
      </View>
    );
  }
  console.log('[DEBUG] Showing Auction real screen');
  return (
    <View style={styles.container}>
      <Text style={{position:'absolute',top:0,left:0,zIndex:10,backgroundColor:'yellow'}}>[DEBUG] REAL SCREEN</Text>
      <Auction />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
});
