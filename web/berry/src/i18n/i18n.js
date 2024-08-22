// i18n/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 导入语言资源
import translationEN from './locales/en/translation.json';
import translationZH from './locales/zh/translation.json';

// 配置 i18next
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: translationEN
    },
    zh: {
      translation: translationZH
    }
  },
  lng: 'en', // 默认语言
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false // React 已经默认防止 XSS
  }
});

export default i18n;