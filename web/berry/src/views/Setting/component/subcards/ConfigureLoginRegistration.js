import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SubCard from 'ui-component/cards/SubCard';
import {
  FormControlLabel, Checkbox, Grid, Box, Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from '@mui/material';
import { showError, showSuccess } from 'utils/common';
import { API } from 'utils/api';

const ConfigureLoginRegistration = () => {
  const { t } = useTranslation();
  const [inputs, setInputs] = useState({
    PasswordLoginEnabled: '',
    PasswordRegisterEnabled: '',
    EmailVerificationEnabled: '',
    GitHubOAuthEnabled: '',
    GoogleOAuthEnabled: '',
    AppleOAuthEnabled: '',
    WeChatAuthEnabled: '',
    RegisterEnabled: '',
    TurnstileCheckEnabled: ''
  });
  const [showPasswordWarningModal, setShowPasswordWarningModal] = useState(false);
  

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await API.get('/api/option/');
        const { success, message, data } = res.data;
        if (success) {
          let newInputs = {};
          data.forEach((item) => {
            newInputs[item.key] = item.value;
          });
          setInputs(newInputs);
        } else {
          showError(message);
        }
      } catch (error) {
        showError(error.message);
      }
    };

    fetchOptions();
  }, []);

  const handleInputChange = async (event) => {
    let { name, checked } = event.target;

    if (name === 'PasswordLoginEnabled' && inputs[name] === 'true') {
      // block disabling password login
      setShowPasswordWarningModal(true);
      return;
    }
    //setInputs((inputs) => ({ ...inputs, [name]: checked ? 'true' : 'false' }));
    await updateOption(name, checked);
  };

  const updateOption = async (key, value) => {
    //setLoading(true);
    //console.log('key:', key, 'value:', value);
    switch (key) {
      case 'PasswordLoginEnabled':
      case 'PasswordRegisterEnabled':
      case 'EmailVerificationEnabled':
      case 'GoogleOAuthEnabled':
      case 'AppleOAuthEnabled':
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
    try {
      const res = await API.put('/api/option/', { key, value });
      //console.log('API response:', res);
      const { success, message } = res.data;
      if (success) {
        setInputs((inputs) => ({ ...inputs, [key]: value }));
        showSuccess(t('settingsSuccess'));
      } else {
        showError(message);
      }
    } catch (error) {
      //console.error('Error updating option:', error);
      showError('Failed to update option');
    } finally {
      //setLoading(false);
    }
  };

  return (
    <>
      <SubCard title={t('configureLoginRegistration')}>
        <Box sx={{ padding: 2 }}>
          <Grid container spacing={{ xs: 3, sm: 2, md: 4 }}>
            <Grid item xs={12} md={3}>
              <FormControlLabel
                label={t('allowPasswordLogin')}
                control={
                  <Checkbox checked={inputs.PasswordLoginEnabled === 'true'} onChange={handleInputChange} name="PasswordLoginEnabled" />
                }
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControlLabel
                label={t('allowPasswordRegistration')}
                control={
                  <Checkbox
                    checked={inputs.PasswordRegisterEnabled === 'true'}
                    onChange={handleInputChange}
                    name="PasswordRegisterEnabled"
                  />
                }
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControlLabel
                label={t('requireEmailVerificationForPasswordRegistration')}
                control={
                  <Checkbox
                    checked={inputs.EmailVerificationEnabled === 'true'}
                    onChange={handleInputChange}
                    name="EmailVerificationEnabled"
                  />
                }
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControlLabel
                label={t('allowGoogleLoginRegistration')}
                control={<Checkbox checked={inputs.GoogleOAuthEnabled === 'true'} onChange={handleInputChange} name="GoogleOAuthEnabled" />}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControlLabel
                label={t('allowAppleLoginRegistration')}
                control={<Checkbox checked={inputs.AppleOAuthEnabled === 'true'} onChange={handleInputChange} name="AppleOAuthEnabled" />}
              />
            </Grid>


            <Grid item xs={12} md={3}>
              <FormControlLabel
                label={t('allowGitHubLoginRegistration')}
                control={<Checkbox checked={inputs.GitHubOAuthEnabled === 'true'} onChange={handleInputChange} name="GitHubOAuthEnabled" />}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControlLabel
                label={t('allowWeChatLoginRegistration')}
                control={<Checkbox checked={inputs.WeChatAuthEnabled === 'true'} onChange={handleInputChange} name="WeChatAuthEnabled" />}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControlLabel
                label={t('allowNewUserRegistration')}
                control={<Checkbox checked={inputs.RegisterEnabled === 'true'} onChange={handleInputChange} name="RegisterEnabled" />}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControlLabel
                label={t('enableTurnstileUserVerification')}
                control={
                  <Checkbox checked={inputs.TurnstileCheckEnabled === 'true'} onChange={handleInputChange} name="TurnstileCheckEnabled" />
                }
              />
            </Grid>
          </Grid>
        </Box>
      </SubCard>

      <Dialog open={showPasswordWarningModal} onClose={() => setShowPasswordWarningModal(false)} maxWidth={'md'}>
        <DialogTitle sx={{ margin: '0px', fontWeight: 700, lineHeight: '1.55556', padding: '24px', fontSize: '1.125rem' }}>
          {t('warning')}
        </DialogTitle>
        <Divider />
        <DialogContent>{t('cancelPasswordLoginWarning')}</DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPasswordWarningModal(false)}>{t('cancel')}</Button>
          <Button
            sx={{ color: 'error.main' }}
            onClick={async () => {
              setShowPasswordWarningModal(false);
              await updateOption('PasswordLoginEnabled', 'false');
            }}
          >
            {t('confirm')}
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
};

export default ConfigureLoginRegistration;