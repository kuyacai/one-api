import React, { useState ,useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, FormControl, InputLabel, OutlinedInput, Button } from '@mui/material';
import SubCard from 'ui-component/cards/SubCard';
import { showError, showSuccess, removeTrailingSlash } from 'utils/common';
import { API } from 'utils/api';

const ConfigureWeChatServer = () => {
  const { t } = useTranslation();
  const [inputs, setInputs] = useState({
    WeChatServerAddress: '',
    WeChatServerToken: '',
    WeChatAccountQRCodeImageURL: ''
  });
  const [loading, setLoading] = useState(false);

  const [originInputs, setOriginInputs] = useState({});

  const getOptions = async () => {
  try {
    const res = await API.get('/api/option/');
    const { success, message, data } = res.data;

    // 记录接口返回的数据
    //console.log('API Response Data:', data);

    if (success) {
      let newInputs = {};
      data.forEach((item) => {
        newInputs[item.key] = item.value;
      });

      // 记录 newInputs 的值
      //console.log('New Inputs:', newInputs);

      setInputs(newInputs);
      setOriginInputs(newInputs);
    } else {
      showError(message);
    }
  } catch (error) {
    //console.error('Error fetching options:', error);
  }
};

  useEffect(() => {
    getOptions().then();
  }, []);

  const updateOption = async (key, value) => {
    setLoading(true);
    switch (key) {
      case 'PasswordLoginEnabled':
      case 'PasswordRegisterEnabled':
      case 'EmailVerificationEnabled':
      case 'GitHubOAuthEnabled':
      case 'WeChatAuthEnabled':
      case 'TurnstileCheckEnabled':
      case 'EmailDomainRestrictionEnabled':
      case 'RegisterEnabled':
        value = inputs[key] === 'true' ? 'false' : 'true';
        break;
      default:
        break;
    }
    const res = await API.put('/api/option/', {
      key,
      value
    });
    const { success, message } = res.data;
    if (success) {
      if (key === 'EmailDomainWhitelist') {
        value = value.split(',');
      }
      setInputs((inputs) => ({
        ...inputs,
        [key]: value
      }));
      showSuccess(t('settingsSuccess'));
    } else {
      showError(message);
    }
    setLoading(false);
  };

  const handleInputChange = async (event) => {
    let { name, value } = event.target;

    if (
      name === 'Notice' ||
      name.startsWith('SMTP') ||
      name === 'ServerAddress' ||
      name === 'GitHubClientId' ||
      name === 'GitHubClientSecret' ||
      name === 'WeChatServerAddress' ||
      name === 'WeChatServerToken' ||
      name === 'WeChatAccountQRCodeImageURL' ||
      name === 'TurnstileSiteKey' ||
      name === 'TurnstileSecretKey' ||
      name === 'EmailDomainWhitelist' ||
      name === 'MessagePusherAddress' ||
      name === 'MessagePusherToken' ||
      name === 'LarkClientId' ||
      name === 'LarkClientSecret'
    ) {
      setInputs((inputs) => ({ ...inputs, [name]: value }));
    } else {
      await updateOption(name, value);
    }
  };

  const submitWeChat = async () => {
    if (originInputs['WeChatServerAddress'] !== inputs.WeChatServerAddress) {
      await updateOption('WeChatServerAddress', removeTrailingSlash(inputs.WeChatServerAddress));
    }
    if (originInputs['WeChatAccountQRCodeImageURL'] !== inputs.WeChatAccountQRCodeImageURL) {
      await updateOption('WeChatAccountQRCodeImageURL', inputs.WeChatAccountQRCodeImageURL);
    }
    if (originInputs['WeChatServerToken'] !== inputs.WeChatServerToken && inputs.WeChatServerToken !== '') {
      await updateOption('WeChatServerToken', inputs.WeChatServerToken);
    }
  };

  return (
    <SubCard
      title={t('configureWeChatServer')}
      subTitle={
        <span>
          {t('supportWeChatLoginRegistration')}
          <a href="https://github.com/songquanpeng/wechat-server" target="_blank" rel="noopener noreferrer">
            {t('clickHere')}
          </a>
          {t('learnAboutWeChatServer')}
        </span>
      }
    >
      <Grid container spacing={{ xs: 3, sm: 2, md: 4 }}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel htmlFor="WeChatServerAddress">{t('wechatServerAddress')}</InputLabel>
            <OutlinedInput
              id="WeChatServerAddress"
              name="WeChatServerAddress"
              value={inputs.WeChatServerAddress || ''}
              onChange={handleInputChange}
              label={t('wechatServerAddress')}
              placeholder="e.g.：https://yourdomain.com"
              disabled={loading}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel htmlFor="WeChatServerToken">{t('wechatServerAccessCredentials')}</InputLabel>
            <OutlinedInput
              id="WeChatServerToken"
              name="WeChatServerToken"
              value={inputs.WeChatServerToken || ''}
              onChange={handleInputChange}
              label={t('wechatServerAccessCredentials')}
              placeholder={t('sensitiveInfoNotSentToFrontend')}
              disabled={loading}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel htmlFor="WeChatAccountQRCodeImageURL">{t('wechatOfficialAccountQRCodeImageLink')}</InputLabel>
            <OutlinedInput
              id="WeChatAccountQRCodeImageURL"
              name="WeChatAccountQRCodeImageURL"
              value={inputs.WeChatAccountQRCodeImageURL || ''}
              onChange={handleInputChange}
              label={t('wechatOfficialAccountQRCodeImageLink')}
              placeholder={t('enterImageLink')}
              disabled={loading}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={submitWeChat}>
            {t('saveWeChatServerSettings')}
          </Button>
        </Grid>
      </Grid>
    </SubCard>
  );
};

export default ConfigureWeChatServer;