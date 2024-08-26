import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SubCard from 'ui-component/cards/SubCard';
import {
    FormControl,
    InputLabel,
    OutlinedInput, Button, Alert
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { showError, showSuccess } from 'utils/common';
import { API } from 'utils/api';

const GoogleOAuthSetting = () => {
  const { t } = useTranslation();
  const [inputs, setInputs] = useState({
    GoogleClientId: '',
    GoogleRedirectUri: '',
    GoogleClientSecret: '',
    ServerAddress: ''
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
      name === 'GoogleClientId' ||
      name === 'GoogleRedirectUri' ||
      name === 'GoogleClientSecret' ||
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


  const submitGoogleOAuth = async () => {
    if (originInputs['GoogleClientId'] !== inputs.GoogleClientId) {
      await updateOption('GoogleClientId', inputs.GoogleClientId);
    }
    if (originInputs['GoogleRedirectUri'] !== inputs.GoogleRedirectUri) {
      await updateOption('GoogleRedirectUri', inputs.GoogleRedirectUri);
    }
    if (originInputs['GoogleClientSecret'] !== inputs.GoogleClientSecret && inputs.GoogleClientSecret !== '') {
      await updateOption('GoogleClientSecret', inputs.GoogleClientSecret);
    }
  };

  return (
    <SubCard
      title={t('configureGoogleOAuthApp')}
      subTitle={
        <span>
          {' '}
          {t('supportGoogleLoginRegistration')}
          <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">
            {t('clickHere')}
          </a>
          {t('manageYourGoogleOAuthApp')}
        </span>
      }
    >
      <Grid container spacing={{ xs: 3, sm: 2, md: 4 }}>
      <Grid xs={12}>
          <Alert severity="info" sx={{ wordWrap: 'break-word' }}>
            {t('homepageURL')}  <b>{inputs.ServerAddress}</b>
            ，Authorization callback URL  <b>{`${inputs.ServerAddress}/oauth/google`}</b>
          </Alert>
        </Grid>
        <Grid xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="GoogleClientId">Google Client ID</InputLabel>
            <OutlinedInput
              id="GoogleClientId"
              name="GoogleClientId"
              value={inputs.GoogleClientId || ''}
              onChange={handleInputChange}
              label="Google Client ID"
              placeholder={t('enterYourGoogleOAuthAppID')}
              disabled={loading}
            />
          </FormControl>
        </Grid>
        <Grid xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="GoogleRedirectUri">Google Redirect Uri</InputLabel>
            <OutlinedInput
              id="GoogleRedirectUri"
              name="GoogleRedirectUri"
              value={inputs.GoogleRedirectUri || ''}
              onChange={handleInputChange}
              label="Google Redirect Uri"
              placeholder={t('enterYourGoogleOAuthAppID')}
              disabled={loading}
            />
          </FormControl>
        </Grid>
        <Grid xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="GoogleClientSecret">Google Client Secret</InputLabel>
            <OutlinedInput
              id="GoogleClientSecret"
              name="GoogleClientSecret"
              value={inputs.GoogleClientSecret || ''}
              onChange={handleInputChange}
              label="Google Client Secret"
              placeholder={t('sensitiveInfoNotSentToFrontend')}
              disabled={loading}
            />
          </FormControl>
        </Grid>
        <Grid xs={12}>
          <Button variant="contained" onClick={submitGoogleOAuth} disabled={loading}>
            {t('saveGoogleOAuthSettings')}
          </Button>
        </Grid>
      </Grid>
    </SubCard>
  );
};

export default GoogleOAuthSetting;