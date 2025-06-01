import React, { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { Switch, View, Alert } from 'react-native';

import Colors from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

const tabNames = ['discover', 'proximity', 'auction'] as const;
type TabName = typeof tabNames[number];

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [mockMode, setMockMode] = useState({
    discover: false,
    proximity: false,
    auction: false,
  });
  const [activeTab, setActiveTab] = useState('discover');

  // Helper to render the slider in the header
  function renderHeaderRight(tabName: TabName) {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
        <Switch
          value={mockMode[tabName]}
          onValueChange={v => {
            console.log(`[DEBUG] Toggling mockMode for ${tabName} to`, v);
            Alert.alert('Mock Switch', `Toggling mockMode for ${tabName} to ${v}`);
            setMockMode((m) => ({ ...m, [tabName]: v }));
          }}
        />
      </View>
    );
  }

  return (
    <Tabs
      initialRouteName="discover"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Networker',
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
          headerRight: () => renderHeaderRight('discover'),
        }}
      />
      <Tabs.Screen
        name="proximity"
        options={{
          title: 'Multisig',
          tabBarIcon: ({ color }) => <TabBarIcon name="lightbulb-o" color={color} />,
          headerRight: () => renderHeaderRight('proximity'),
        }}
      />
      <Tabs.Screen
        name="auction"
        options={{
          title: 'Auction',
          tabBarIcon: ({ color }) => <TabBarIcon name="gavel" color={color} />,
          headerRight: () => renderHeaderRight('auction'),
        }}
      />
      <Tabs.Screen
        name="troubleshooting"
        options={{
          title: 'Troubleshooting',
          tabBarIcon: ({ color }) => <TabBarIcon name="wrench" color={color} />,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color }) => <TabBarIcon name="credit-card" color={color} />,
        }}
      />
    </Tabs>
  );
}
