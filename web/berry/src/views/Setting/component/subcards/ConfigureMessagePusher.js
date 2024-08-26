import React, { useState ,useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, FormControl, InputLabel, OutlinedInput, Button } from '@mui/material';
import SubCard from 'ui-component/cards/SubCard';
import { showError, showSuccess ,removeTrailingSlash} from 'utils/common';
import { API } from 'utils/api';

const ConfigureMessagePusher = () => {
  const { t } = useTranslation();
  const [inputs, setInputs] = useState({
    MessagePusherAddress: '',
    MessagePusherToken: ''
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
    console.error('Error fetching options:', error);
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

  const submitMessagePusher = async () => {
    if (originInputs['MessagePusherAddress'] !== inputs.MessagePusherAddress) {
      await updateOption('MessagePusherAddress', removeTrailingSlash(inputs.MessagePusherAddress));
    }
    if (originInputs['MessagePusherToken'] !== inputs.MessagePusherToken && inputs.MessagePusherToken !== '') {
      await updateOption('MessagePusherToken', inputs.MessagePusherToken);
    }
  };

  return (
    <SubCard
      title={t('configureMessagePusher')}
      subTitle={
        <span>
          {t('supportAlertPush')}
          <a href="https://github.com/songquanpeng/message-pusher" target="_blank" rel="noreferrer">
            {t('clickHere')}
          </a>
          {t('learnAboutMessagePusher')}
        </span>
      }
    >
      <Grid container spacing={{ xs: 3, sm: 2, md: 4 }}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="MessagePusherAddress">{t('messagePusherPushAddress')}</InputLabel>
            <OutlinedInput
              id="MessagePusherAddress"
              name="MessagePusherAddress"
              value={inputs.MessagePusherAddress || ''}
              onChange={handleInputChange}
              label={t('messagePusherPushAddress')}
              placeholder="e.g.：https://msgpusher.com/push/your_username"
              disabled={loading}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="MessagePusherToken">{t('messagePusherAccessCredentials')}</InputLabel>
            <OutlinedInput
              id="MessagePusherToken"
              name="MessagePusherToken"
              type="password"
              value={inputs.MessagePusherToken || ''}
              onChange={handleInputChange}
              label={t('messagePusherAccessCredentials')}
              placeholder={t('sensitiveInfoNotSentToFrontend')}
              disabled={loading}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={submitMessagePusher}>
            {t('saveMessagePusherSettings')}
          </Button>
        </Grid>
      </Grid>
    </SubCard>
  );
};

export default ConfigureMessagePusher;