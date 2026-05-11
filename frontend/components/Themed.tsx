import { Text as DefaultText, View as DefaultView } from 'react-native'

import Colors from '@/constants/Colors'
import { typography } from '@/theme/typography'
import { useColorScheme } from './useColorScheme'

type ThemeProps = {
  lightColor?: string
  darkColor?: string
}

export type TextProps = ThemeProps & DefaultText['props']
export type ViewProps = ThemeProps & DefaultView['props']

type ColorName = keyof typeof Colors.light & keyof typeof Colors.dark

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ColorName,
) {
  const theme = useColorScheme() ?? 'light'
  const colorFromProps = props[theme]

  if (colorFromProps) {
    return colorFromProps
  }
  return Colors[theme][colorName]
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props
  const { color: _bodyColor, ...bodyFont } = typography.body
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'textMuted')

  return <DefaultText style={[bodyFont, { color }, style]} {...otherProps} />
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background')

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />
}
