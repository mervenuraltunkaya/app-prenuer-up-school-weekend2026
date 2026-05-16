import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Tabs } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { MainTabBar } from '@/components/navigation/MainTabBar'
import Colors from '@/constants/Colors'
import { useColorScheme } from '@/components/useColorScheme'

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name']
  color: string
}) {
  return <FontAwesome size={22} style={{ marginBottom: -2 }} {...props} />
}

export default function TabLayout() {
  const { t } = useTranslation()
  const colorScheme = useColorScheme()
  const scheme = colorScheme ?? 'light'
  const c = Colors[scheme]

  return (
    <Tabs
      tabBar={(props) => <MainTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: c.tabIconSelected,
        tabBarInactiveTintColor: c.tabIconDefault,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="explore"
        options={{
          title: t('tabs.explore'),
          tabBarIcon: ({ color }) => <TabBarIcon name="map" color={color} />,
        }}
      />
      <Tabs.Screen
        name="routes"
        options={{
          title: t('tabs.routes'),
          tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: t('tabs.reports'),
          tabBarIcon: ({ color }) => <TabBarIcon name="warning" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  )
}
