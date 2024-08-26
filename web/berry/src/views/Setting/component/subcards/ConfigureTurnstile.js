import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, FormControl, InputLabel, OutlinedInput, Button } from '@mui/material';
import SubCard from 'ui-component/cards/SubCard';
import { showError, showSuccess } from 'utils/common';
import { API } from 'utils/api';

const ConfigureTurnstile = () => {
  const { t } = useTranslation();
  const [inputs, setInputs] = useState({
    TurnstileSiteKey: '',
    TurnstileSecretKey: ''
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

  const submitTurnstile = async () => {
    if (originInputs['TurnstileSiteKey'] !== inputs.TurnstileSiteKey) {
      await updateOption('TurnstileSiteKey', inputs.TurnstileSiteKey);
    }
    if (originInputs['TurnstileSecretKey'] !== inputs.TurnstileSecretKey && inputs.TurnstileSecretKey !== '') {
      await updateOption('TurnstileSecretKey', inputs.TurnstileSecretKey);
    }
  };

  return (
    <SubCard
      title={t('configureTurnstile')}
      subTitle={
        <span>
          {t('supportUserVerification')}
          <a href="https://dash.cloudflare.com/" target="_blank" rel="noopener noreferrer">
            {t('clickHere')}
          </a>
          {t('manageYourTurnstileSites')}
        </span>
      }
    >
      <Grid container spacing={{ xs: 3, sm: 2, md: 4 }}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="TurnstileSiteKey">Turnstile Site Key</InputLabel>
            <OutlinedInput
              id="TurnstileSiteKey"
              name="TurnstileSiteKey"
              value={inputs.TurnstileSiteKey || ''}
              onChange={handleInputChange}
              label="Turnstile Site Key"
              placeholder={t('enterTurnstileSiteKey')}
              disabled={loading}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="TurnstileSecretKey">Turnstile Secret Key</InputLabel>
            <OutlinedInput
              id="TurnstileSecretKey"
              name="TurnstileSecretKey"
              type="password"
              value={inputs.TurnstileSecretKey || ''}
              onChange={handleInputChange}
              label="Turnstile Secret Key"
              placeholder={t('sensitiveInfoNotSentToFrontend')}
              disabled={loading}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={submitTurnstile}>
            {t('saveTurnstileSettings')}
          </Button>
        </Grid>
      </Grid>
    </SubCard>
  );
};

export default ConfigureTurnstile;