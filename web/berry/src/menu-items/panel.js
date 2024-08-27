// assets
import {
  IconDashboard,
  IconSitemap,
  IconArticle,
  IconCoin,
  IconAdjustments,
  IconKey,
  IconGardenCart,
  IconUser,
  IconUserScan
} from '@tabler/icons-react';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../i18n/locales/en/translation.json';
import zh from '../i18n/locales/zh/translation.json';

// constant
const icons = { IconDashboard, IconSitemap, IconArticle, IconCoin, IconAdjustments, IconKey, IconGardenCart, IconUser, IconUserScan };

// 占位符对象
const panel = {
  id: 'panel',
  type: 'group',
  children: []
};

// 初始化 i18n
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en
      },
      zh: {
        translation: zh
      }
    },
    lng: 'en', // 默认语言
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React 已经默认防止 XSS
    }
  }, () => {
    // 确保 i18n 初始化完成后再执行后续代码
    //console.log('i18n initialized:', i18n.isInitialized);

    // 更新 panel 的内容
    panel.children = [
      {
        id: 'dashboard',
        title: i18n.t('overview'),
        type: 'item',
        url: '/panel/dashboard',
        icon: icons.IconDashboard,
        breadcrumbs: false,
        isAdmin: false
      },
      {
        id: 'channel',
        title: i18n.t('channel'),
        type: 'item',
        url: '/panel/channel',
        icon: icons.IconSitemap,
        breadcrumbs: false,
        isAdmin: true
      },
      {
        id: 'token',
        title: i18n.t('token'),
        type: 'item',
        url: '/panel/token',
        icon: icons.IconKey,
        breadcrumbs: false
      },
      {
        id: 'log',
        title: i18n.t('log'),
        type: 'item',
        url: '/panel/log',
        icon: icons.IconArticle,
        breadcrumbs: false
      },
      {
        id: 'redemption',
        title: i18n.t('redemption'),
        type: 'item',
        url: '/panel/redemption',
        icon: icons.IconCoin,
        breadcrumbs: false,
        isAdmin: true
      },
      {
        id: 'topup',
        title: i18n.t('topup'),
        type: 'item',
        url: '/panel/topup',
        icon: icons.IconGardenCart,
        breadcrumbs: false
      },
      {
        id: 'user',
        title: i18n.t('user'),
        type: 'item',
        url: '/panel/user',
        icon: icons.IconUser,
        breadcrumbs: false,
        isAdmin: true
      },
      {
        id: 'profile',
        title: i18n.t('profile'),
        type: 'item',
        url: '/panel/profile',
        icon: icons.IconUserScan,
        breadcrumbs: false,
        isAdmin: false
      },
      {
        id: 'setting',
        title: i18n.t('setting'),
        type: 'item',
        url: '/panel/setting',
        icon: icons.IconAdjustments,
        breadcrumbs: false,
        isAdmin: true
      }
    ];

    
  });

export default panel;