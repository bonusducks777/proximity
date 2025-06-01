import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import React from 'react';

import { Text, View } from '../components/Themed';

export default function NotFoundScreen() {
  // Redirect to Networker tab if this screen is ever hit
  React.useEffect(() => {
    // Use expo-router's router to redirect
    import('expo-router').then(({ router }) => {
      router.replace('/discover');
    });
  }, []);

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
