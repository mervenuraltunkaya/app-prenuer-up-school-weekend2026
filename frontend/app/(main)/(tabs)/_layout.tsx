import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Tabs } from 'expo-router'
import React from 'react'
<<<<<<< HEAD
import { useTranslation } from 'react-i18next'

import { MainTabBar } from '@/components/navigation/MainTabBar'
import Colors from '@/constants/Colors'
import { useColorScheme } from '@/components/useColorScheme'
=======
import { Platform } from 'react-native'

import Colors from '@/constants/Colors'
import { useColorScheme } from '@/components/useColorScheme'
import { colors } from '@/theme/colors'
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name']
  color: string
}) {
  return <FontAwesome size={22} style={{ marginBottom: -2 }} {...props} />
}

export default function TabLayout() {
<<<<<<< HEAD
  const { t } = useTranslation()
=======
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
  const colorScheme = useColorScheme()
  const scheme = colorScheme ?? 'light'
  const c = Colors[scheme]

  return (
    <Tabs
<<<<<<< HEAD
      tabBar={(props) => <MainTabBar {...props} />}
=======
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
      screenOptions={{
        tabBarActiveTintColor: c.tabIconSelected,
        tabBarInactiveTintColor: c.tabIconDefault,
        headerShown: false,
<<<<<<< HEAD
=======
        tabBarStyle: {
          backgroundColor: scheme === 'dark' ? c.card : colors.cream,
          borderTopColor: colors.border,
          borderTopWidth: Platform.OS === 'ios' ? 0.5 : 1,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: 'DMSans_500Medium',
        },
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
      }}>
      <Tabs.Screen
        name="explore"
        options={{
<<<<<<< HEAD
          title: t('tabs.explore'),
=======
          title: 'Keşif',
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
          tabBarIcon: ({ color }) => <TabBarIcon name="map" color={color} />,
        }}
      />
      <Tabs.Screen
        name="routes"
        options={{
<<<<<<< HEAD
          title: t('tabs.routes'),
=======
          title: 'Rotalar',
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
          tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
<<<<<<< HEAD
          title: t('tabs.reports'),
=======
          title: 'Raporlarım',
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
          tabBarIcon: ({ color }) => <TabBarIcon name="warning" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
<<<<<<< HEAD
          title: t('tabs.profile'),
=======
          title: 'Profil',
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  )
}
