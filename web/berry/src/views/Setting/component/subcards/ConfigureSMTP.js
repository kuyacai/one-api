import React, { useState , useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, FormControl, InputLabel, OutlinedInput, Button } from '@mui/material';
import SubCard from 'ui-component/cards/SubCard';
import { showError, showSuccess } from 'utils/common';
import { API } from 'utils/api';


const ConfigureSMTP = () => {
  const { t } = useTranslation();
  const [inputs, setInputs] = useState({
    SMTPServer: '',
    SMTPPort: '',
    SMTPAccount: '',
    SMTPFrom: '',
    SMTPToken: ''
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

  const submitSMTP = async () => {
    if (originInputs['SMTPServer'] !== inputs.SMTPServer) {
      await updateOption('SMTPServer', inputs.SMTPServer);
    }
    if (originInputs['SMTPAccount'] !== inputs.SMTPAccount) {
      await updateOption('SMTPAccount', inputs.SMTPAccount);
    }
    if (originInputs['SMTPFrom'] !== inputs.SMTPFrom) {
      await updateOption('SMTPFrom', inputs.SMTPFrom);
    }
    if (originInputs['SMTPPort'] !== inputs.SMTPPort && inputs.SMTPPort !== '') {
      await updateOption('SMTPPort', inputs.SMTPPort);
    }
    if (originInputs['SMTPToken'] !== inputs.SMTPToken && inputs.SMTPToken !== '') {
      await updateOption('SMTPToken', inputs.SMTPToken);
    }
  };

  return (
    <SubCard title={t('configureSMTP')} subTitle={t('supportSystemEmailSending')}>
      <Grid container spacing={{ xs: 3, sm: 2, md: 4 }}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel htmlFor="SMTPServer">{t('smtpServerAddress')}</InputLabel>
            <OutlinedInput
              id="SMTPServer"
              name="SMTPServer"
              value={inputs.SMTPServer || ''}
              onChange={handleInputChange}
              label={t('smtpServerAddress')}
              placeholder="e.g.：smtp.qq.com"
              disabled={loading}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel htmlFor="SMTPPort">{t('smtpPort')}</InputLabel>
            <OutlinedInput
              id="SMTPPort"
              name="SMTPPort"
              value={inputs.SMTPPort || ''}
              onChange={handleInputChange}
              label={t('smtpPort')}
              placeholder="default: 587"
              disabled={loading}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel htmlFor="SMTPAccount">{t('smtpAccount')}</InputLabel>
            <OutlinedInput
              id="SMTPAccount"
              name="SMTPAccount"
              value={inputs.SMTPAccount || ''}
              onChange={handleInputChange}
              label={t('smtpAccount')}
              placeholder={t('usuallyEmailAddress')}
              disabled={loading}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel htmlFor="SMTPFrom">{t('smtpSenderEmail')}</InputLabel>
            <OutlinedInput
              id="SMTPFrom"
              name="SMTPFrom"
              value={inputs.SMTPFrom || ''}
              onChange={handleInputChange}
              label={t('smtpSenderEmail')}
              placeholder={t('usuallySameAsEmailAddress')}
              disabled={loading}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel htmlFor="SMTPToken">{t('smtpAccessCredentials')}</InputLabel>
            <OutlinedInput
              id="SMTPToken"
              name="SMTPToken"
              value={inputs.SMTPToken || ''}
              onChange={handleInputChange}
              label={t('smtpAccessCredentials')}
              placeholder={t('sensitiveInfoNotSentToFrontend')}
              disabled={loading}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={submitSMTP}>
            {t('saveSMTPSettings')}
          </Button>
        </Grid>
      </Grid>
    </SubCard>
  );
};

export default ConfigureSMTP;