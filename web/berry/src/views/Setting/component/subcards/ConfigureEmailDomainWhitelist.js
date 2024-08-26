import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { Grid, FormControlLabel, Checkbox, FormControl, Autocomplete, TextField, Button } from '@mui/material';
import SubCard from 'ui-component/cards/SubCard';
import { showError, showSuccess } from 'utils/common';
import { API } from 'utils/api';

const filter = createFilterOptions();
const ConfigureEmailDomainWhitelist = () => {
  const { t } = useTranslation();
  const [inputs, setInputs] = useState({
    EmailDomainRestrictionEnabled: '',
    EmailDomainWhitelist: []
  });
  //let [loading, setLoading] = useState(false);

  const [EmailDomainWhitelist, setEmailDomainWhitelist] = useState([]);

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

          // 确保 EmailDomainWhitelist 是一个数组
          if (typeof newInputs.EmailDomainWhitelist === 'string') {
            newInputs.EmailDomainWhitelist = newInputs.EmailDomainWhitelist.split(',');
          } else if (!Array.isArray(newInputs.EmailDomainWhitelist)) {
            newInputs.EmailDomainWhitelist = [];
          }

          setInputs(newInputs);
          setEmailDomainWhitelist(newInputs.EmailDomainWhitelist);
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

  const submitEmailDomainWhitelist = async () => {
    await updateOption('EmailDomainWhitelist', inputs.EmailDomainWhitelist.join(','));
  };

  const updateOption = async (key, value) => {
    //setLoading(true);
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
    //setLoading(false);
  };


  return (
    <SubCard title={t('configureEmailDomainWhitelist')} subTitle={t('preventMaliciousUsersUsingTemporaryEmails')}>
      <Grid container spacing={{ xs: 3, sm: 2, md: 4 }}>
        <Grid item xs={12}>
          <FormControlLabel
            label={t('enableEmailDomainWhitelist')}
            control={
              <Checkbox
                checked={inputs.EmailDomainRestrictionEnabled === 'true'}
                onChange={handleInputChange}
                name="EmailDomainRestrictionEnabled"
              />
            }
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <Autocomplete
              multiple
              freeSolo
              id="EmailDomainWhitelist"
              options={EmailDomainWhitelist}
              value={inputs.EmailDomainWhitelist}
              onChange={(e, value) => {
                const event = {
                  target: {
                    name: 'EmailDomainWhitelist',
                    value: value
                  }
                };
                handleInputChange(event);
              }}
              filterSelectedOptions
              renderInput={(params) => <TextField {...params} name="EmailDomainWhitelist" label={t('allowedEmailDomains')} />}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);
                const { inputValue } = params;
                const isExisting = options.some((option) => inputValue === option);
                if (inputValue !== '' && !isExisting) {
                  filtered.push(inputValue);
                }
                return filtered;
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={submitEmailDomainWhitelist}>
            {t('saveEmailDomainWhitelistSettings')}
          </Button>
        </Grid>
      </Grid>
    </SubCard>
  );
};

export default ConfigureEmailDomainWhitelist;