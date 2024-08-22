import i18n from 'i18next';

const LOG_TYPE = {
  0: { value: '0', text: i18n.t('all'), color: '' },
  1: { value: '1', text: i18n.t('recharge'), color: 'primary' },
  2: { value: '2', text: i18n.t('consumption'), color: 'orange' },
  3: { value: '3', text: i18n.t('management'), color: 'default' },
  4: { value: '4', text: i18n.t('system'), color: 'secondary' }
};

export default LOG_TYPE;