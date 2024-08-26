import React, { useState,useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, FormControl, InputLabel, OutlinedInput, Button, Alert } from '@mui/material';
import SubCard from 'ui-component/cards/SubCard';
import { showError, showSuccess } from 'utils/common';
import { API } from 'utils/api';

const ConfigureFeishuOAuth = () => {
  const { t } = useTranslation();
  const [inputs, setInputs] = useState({
    ServerAddress: '',
    LarkClientId: '',
    LarkClientSecret: ''
  });
  const [loading, setLoading] = useState(false);
  const [originInputs, setOriginInputs] = useState({});
  const getOptions = async () => {
    const res = await API.get('/api/option/');
    const { success, message, data } = res.data;
    if (success) {
      let newInputs = {};
      data.forEach((item) => {
        newInputs[item.key] = item.value;
      });
      setInputs(newInputs);
      setOriginInputs(newInputs);

      
    } else {
      showError(message);
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

  const submitLarkOAuth = async () => {
    if (originInputs['LarkClientId'] !== inputs.LarkClientId) {
      await updateOption('LarkClientId', inputs.LarkClientId);
    }
    if (originInputs['LarkClientSecret'] !== inputs.LarkClientSecret && inputs.LarkClientSecret !== '') {
      await updateOption('LarkClientSecret', inputs.LarkClientSecret);
    }
  };

  return (
    <SubCard
      title={t('configureFeishuOAuthLogin')}
      subTitle={
        <span>
          {' '}
          {t('supportFeishuLoginRegistration')}
          <a href="https://open.feishu.cn/app" target="_blank" rel="noreferrer">
            {t('clickHere')}
          </a>
          {t('manageYourFeishuApp')}
        </span>
      }
    >
      <Grid container spacing={{ xs: 3, sm: 2, md: 4 }}>
        <Grid item xs={12}>
          <Alert severity="info" sx={{ wordWrap: 'break-word' }}>
            {t('homepageLink')} <code>{inputs.ServerAddress}</code>
            ，{t('redirectURL')}<code>{`${inputs.ServerAddress}/oauth/lark`}</code>
          </Alert>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="LarkClientId">App ID</InputLabel>
            <OutlinedInput
              id="LarkClientId"
              name="LarkClientId"
              value={inputs.LarkClientId || ''}
              onChange={handleInputChange}
              label="App ID"
              placeholder={t('enterAppID')}
              disabled={loading}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="LarkClientSecret">App Secret</InputLabel>
            <OutlinedInput
              id="LarkClientSecret"
              name="LarkClientSecret"
              value={inputs.LarkClientSecret || ''}
              onChange={handleInputChange}
              label="App Secret"
              placeholder={t('sensitiveInfoNotSentToFrontend')}
              disabled={loading}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={submitLarkOAuth}>
            {t('saveFeishuOAuthSettings')}
          </Button>
        </Grid>
      </Grid>
    </SubCard>
  );
};

export default ConfigureFeishuOAuth;