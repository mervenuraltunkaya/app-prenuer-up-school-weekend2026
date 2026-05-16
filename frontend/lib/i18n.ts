import * as Localization from 'expo-localization'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from '@/locales/en.json'
import tr from '@/locales/tr.json'

const SUPPORTED = ['tr', 'en'] as const
export type AppLocale = (typeof SUPPORTED)[number]

function resolveDeviceLocale(): AppLocale {
  const codes = Localization.getLocales().map((l) => l.languageCode?.toLowerCase() ?? '')
  for (const code of codes) {
    if (code.startsWith('tr')) return 'tr'
    if (code.startsWith('en')) return 'en'
  }
  return 'tr'
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      tr: { translation: tr },
      en: { translation: en },
    },
    lng: resolveDeviceLocale(),
    fallbackLng: 'tr',
    supportedLngs: [...SUPPORTED],
    interpolation: { escapeValue: false },
    compatibilityJSON: 'v4',
  })
}

export default i18n
