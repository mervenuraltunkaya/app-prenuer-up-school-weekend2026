import FontAwesome from '@expo/vector-icons/FontAwesome'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { router } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { colors } from '@/theme/colors'
import { spacing } from '@/theme/spacing'
import { fontFamilies } from '@/theme/typography'

const TABS = [
  { name: 'explore', label: 'KEŞFET', icon: 'map' as const },
  { name: 'routes', label: 'ROTALAR', icon: 'random' as const },
  { name: 'reports', label: 'RAPORLAR', icon: 'flag' as const },
  { name: 'profile', label: 'PROFİL', icon: 'user' as const },
]

export function MainTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets()

  function renderTab(tabName: string, label: string, icon: typeof TABS[number]['icon']) {
    const routeIndex = state.routes.findIndex((r) => r.name === tabName)
    if (routeIndex < 0) return null
    const route = state.routes[routeIndex]
    const isFocused = state.index === routeIndex
    const color = isFocused ? colors.crimson : colors.brown

    return (
      <Pressable
        key={tabName}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        style={styles.tab}
        onPress={() => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params)
          }
        }}>
        <FontAwesome name={icon} size={20} color={color} />
        <Text style={[styles.tabLabel, { color }]}>{label}</Text>
        {isFocused ? <View style={styles.dot} /> : <View style={styles.dotSpacer} />}
      </Pressable>
    )
  }

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      {renderTab('explore', TABS[0].label, TABS[0].icon)}
      {renderTab('routes', TABS[1].label, TABS[1].icon)}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Yeni hasar raporu"
        style={styles.fab}
        onPress={() => router.push('/report/new')}>
        <FontAwesome name="camera" size={22} color={colors.white} />
      </Pressable>
      {renderTab('reports', TABS[2].label, TABS[2].icon)}
      {renderTab('profile', TABS[3].label, TABS[3].icon)}
    </View>
  )
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    backgroundColor: colors.white,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: spacing.xs,
  },
  tabLabel: {
    fontFamily: fontFamilies.dmMedium,
    fontSize: 9,
    letterSpacing: 0.6,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.crimson,
    marginTop: 2,
  },
  dotSpacer: {
    width: 4,
    height: 4,
    marginTop: 2,
  },
  fab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.crimson,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -22,
    marginHorizontal: 2,
    shadowColor: colors.crimson,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
})
