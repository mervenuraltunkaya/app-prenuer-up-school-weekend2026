import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  type Theme,
} from '@react-navigation/native'

import { colors } from './colors'
import { fontFamilies } from './typography'

export const NomadLightTheme: Theme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    primary: colors.crimson,
    background: colors.surface,
    card: colors.cream,
    text: colors.ink,
    border: colors.border,
    notification: colors.crimson,
  },
  fonts: {
    ...NavigationDefaultTheme.fonts,
    regular: { fontFamily: fontFamilies.dmRegular, fontWeight: '400' },
    medium: { fontFamily: fontFamilies.dmMedium, fontWeight: '500' },
    bold: { fontFamily: fontFamilies.dmMedium, fontWeight: '600' },
    heavy: { fontFamily: fontFamilies.playfairSemi, fontWeight: '600' },
  },
}

const darkCard = '#352A22'

export const NomadDarkTheme: Theme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    primary: colors.crimsonLight,
    background: colors.ink,
    card: darkCard,
    text: colors.cream,
    border: colors.borderStrong,
    notification: colors.terracotta,
  },
  fonts: {
    ...NavigationDarkTheme.fonts,
    regular: { fontFamily: fontFamilies.dmRegular, fontWeight: '400' },
    medium: { fontFamily: fontFamilies.dmMedium, fontWeight: '500' },
    bold: { fontFamily: fontFamilies.dmMedium, fontWeight: '600' },
    heavy: { fontFamily: fontFamilies.playfairSemi, fontWeight: '600' },
  },
}
