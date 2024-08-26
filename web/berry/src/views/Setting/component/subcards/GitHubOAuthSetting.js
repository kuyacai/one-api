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

const GitHubOAuthSetting = () => {
  const { t } = useTranslation();
  const [inputs, setInputs] = useState({
    GitHubClientId: '',
    GitHubClientSecret: '',
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


  const submitGitHubOAuth = async () => {
    if (originInputs['GitHubClientId'] !== inputs.GitHubClientId) {
      await updateOption('GitHubClientId', inputs.GitHubClientId);
    }
    if (originInputs['GitHubClientSecret'] !== inputs.GitHubClientSecret && inputs.GitHubClientSecret !== '') {
      await updateOption('GitHubClientSecret', inputs.GitHubClientSecret);
    }
  };

  return (
    <SubCard
      title={t('configureGitHubOAuthApp')}
      subTitle={
        <span>
          {' '}
          {t('supportGitHubLoginRegistration')}
          <a href="https://github.com/settings/developers" target="_blank" rel="noopener noreferrer">
            {t('clickHere')}
          </a>
          {t('manageYourGitHubOAuthApp')}
        </span>
      }
    >
      <Grid container spacing={{ xs: 3, sm: 2, md: 4 }}>
        <Grid xs={12}>
          <Alert severity="info" sx={{ wordWrap: 'break-word' }}>
            {t('homepageURL')}  <b>{inputs.ServerAddress}</b>
            ，Authorization callback URL  <b>{`${inputs.ServerAddress}/oauth/github`}</b>
          </Alert>
        </Grid>
        <Grid xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="GitHubClientId">GitHub Client ID</InputLabel>
            <OutlinedInput
              id="GitHubClientId"
              name="GitHubClientId"
              value={inputs.GitHubClientId || ''}
              onChange={handleInputChange}
              label="GitHub Client ID"
              placeholder={t('enterYourGitHubOAuthAppID')}
              disabled={loading}
            />
          </FormControl>
        </Grid>
        <Grid xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="GitHubClientSecret">GitHub Client Secret</InputLabel>
            <OutlinedInput
              id="GitHubClientSecret"
              name="GitHubClientSecret"
              value={inputs.GitHubClientSecret || ''}
              onChange={handleInputChange}
              label="GitHub Client Secret"
              placeholder={t('sensitiveInfoNotSentToFrontend')}
              disabled={loading}
            />
          </FormControl>
        </Grid>
        <Grid xs={12}>
          <Button variant="contained" onClick={submitGitHubOAuth} disabled={loading}>
            {t('saveGitHubOAuthSettings')}
          </Button>
        </Grid>
      </Grid>
    </SubCard>
  );
};

export default GitHubOAuthSetting;