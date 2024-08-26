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

const AppleOAuthSetting = () => {
  const { t } = useTranslation();
  const [inputs, setInputs] = useState({
    AppleClientId: '',
    AppleRedirectUri: '',
    AppleTeamId: '',
    AppleClientSecret: '',
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
      name === 'AppleClientId' ||
      name === 'AppleRedirectUri' ||
      name === 'AppleTeamId' ||
      name === 'AppleClientSecret' ||
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


  const submitAppleOAuth = async () => {
    if (originInputs['AppleClientId'] !== inputs.AppleClientId) {
      await updateOption('AppleClientId', inputs.AppleClientId);
    }
    if (originInputs['AppleRedirectUri'] !== inputs.AppleRedirectUri) {
      await updateOption('AppleRedirectUri', inputs.AppleRedirectUri);
    }
    if (originInputs['AppleTeamId'] !== inputs.AppleTeamId) {
      await updateOption('AppleTeamId', inputs.AppleTeamId);
    }
    if (originInputs['AppleClientSecret'] !== inputs.AppleClientSecret && inputs.AppleClientSecret !== '') {
      await updateOption('AppleClientSecret', inputs.AppleClientSecret);
    }
  };

  return (
    <SubCard
      title={t('configureAppleOAuthApp')}
      subTitle={
        <span>
          {' '}
          {t('supportAppleLoginRegistration')}
          <a href="https://developer.apple.com/account/" target="_blank" rel="noopener noreferrer">
            {t('clickHere')}
          </a>
          {t('manageYourAppleOAuthApp')}
        </span>
      }
    >
      <Grid container spacing={{ xs: 3, sm: 2, md: 4 }}>
      <Grid xs={12}>
          <Alert severity="info" sx={{ wordWrap: 'break-word' }}>
            {t('homepageURL')}  <b>{inputs.ServerAddress}</b>
            ，Authorization callback URL  <b>{`${inputs.ServerAddress}/oauth/apple`}</b>
          </Alert>
        </Grid>
        <Grid xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="AppleClientId">Apple Client ID</InputLabel>
            <OutlinedInput
              id="AppleClientId"
              name="AppleClientId"
              value={inputs.AppleClientId || ''}
              onChange={handleInputChange}
              label="Apple Client ID"
              placeholder={t('enterYourAppleOAuthAppID')}
              disabled={loading}
            />
          </FormControl>
        </Grid>
        <Grid xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="AppleRedirectUri">Apple Redirect Uri</InputLabel>
            <OutlinedInput
              id="AppleRedirectUri"
              name="AppleRedirectUri"
              value={inputs.AppleRedirectUri || ''}
              onChange={handleInputChange}
              label="Apple Redirect Uri"
              placeholder={t('enterYourAppleOAuthAppID')}
              disabled={loading}
            />
          </FormControl>
        </Grid>
        <Grid xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="AppleTeamId">Apple Team ID</InputLabel>
            <OutlinedInput
              id="AppleTeamId"
              name="AppleTeamId"
              value={inputs.AppleTeamId || ''}
              onChange={handleInputChange}
              label="Apple Team ID"
              placeholder={t('enterYourAppleOAuthTeamID')}
              disabled={loading}
            />
          </FormControl>
        </Grid>
        <Grid xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="AppleClientSecret">Apple Client Secret</InputLabel>
            <OutlinedInput
              id="AppleClientSecret"
              name="AppleClientSecret"
              value={inputs.AppleClientSecret || ''}
              onChange={handleInputChange}
              label="Apple Client Secret"
              placeholder={t('sensitiveInfoNotSentToFrontend')}
              disabled={loading}
            />
          </FormControl>
        </Grid>
        <Grid xs={12}>
          <Button variant="contained" onClick={submitAppleOAuth} disabled={loading}>
            {t('saveAppleOAuthSettings')}
          </Button>
        </Grid>
      </Grid>
    </SubCard>
  );
};

export default AppleOAuthSetting;