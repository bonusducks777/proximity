import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useAppContext } from '../../context/AppContext';
import Discover from './discover';

const MOCK_URL = 'https://preview--aura-proximity-connect.lovable.app';

export default function DiscoverTabWrapper() {
  const { mockMode } = useAppContext();
  return (
    <View style={styles.container}>
      {mockMode.discover ? (
        <WebView source={{ uri: MOCK_URL }} style={styles.webview} />
      ) : (
        <Discover />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
});
