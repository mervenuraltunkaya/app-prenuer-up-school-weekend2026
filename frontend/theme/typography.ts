import type { TextStyle } from 'react-native'

import { colors } from './colors'

export const fontFamilies = {
  playfairSemi: 'PlayfairDisplay_600SemiBold',
  playfairMedium: 'PlayfairDisplay_500Medium',
  dmRegular: 'DMSans_400Regular',
  dmMedium: 'DMSans_500Medium',
} as const

export const typography = {
  h1: {
    fontFamily: fontFamilies.playfairSemi,
    fontSize: 26,
    lineHeight: 31,
    letterSpacing: -0.3,
    color: colors.ink,
  } satisfies TextStyle,
  h2: {
    fontFamily: fontFamilies.playfairMedium,
    fontSize: 20,
    lineHeight: 26,
    color: colors.ink,
  } satisfies TextStyle,
  h3: {
    fontFamily: fontFamilies.dmMedium,
    fontSize: 15,
    lineHeight: 21,
    color: colors.ink,
  } satisfies TextStyle,
  body: {
    fontFamily: fontFamilies.dmRegular,
    fontSize: 14,
    lineHeight: 22,
    color: colors.inkMuted,
  } satisfies TextStyle,
  caption: {
    fontFamily: fontFamilies.dmRegular,
    fontSize: 11,
    lineHeight: 16,
    color: colors.brown,
  } satisfies TextStyle,
  label: {
    fontFamily: fontFamilies.dmMedium,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.brown,
  } satisfies TextStyle,
} as const
