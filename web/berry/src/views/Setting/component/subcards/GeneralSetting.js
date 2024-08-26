import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import SubCard from 'ui-component/cards/SubCard';
import {
  FormControl,
  InputLabel,
  OutlinedInput, Button
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { showError, showSuccess, removeTrailingSlash } from 'utils/common';
import { API } from 'utils/api';

const GeneralSetting = ({ title, placeholder }) => {
  const { t } = useTranslation();
  const [inputs, setInputs] = useState({
    ServerAddress: ''
  });
  const [loading, setLoading] = useState(false);

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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  const handleSubmit = async (key, value) => {
    if (key === 'ServerAddress') {
      value = removeTrailingSlash(value);
    }
    setLoading(true);
    try {
      const res = await API.put('/api/option/', { key, value });
      const { success, message } = res.data;
      if (success) {
        setInputs((inputs) => ({
          ...inputs,
          [key]: value
        }));
        showSuccess(t('settingsSuccess'));
      } else {
        showError(message);
      }
    } catch (error) {
      showError(error.message);
    }
    setLoading(false);
  };

  return (
    <SubCard title={title || t('generalSettings')}>
      <Grid container spacing={{ xs: 3, sm: 2, md: 4 }}>
        <Grid xs={12}>
          <FormControl fullWidth>
            <InputLabel htmlFor="ServerAddress">{t('serverAddress')}</InputLabel>
            <OutlinedInput
              id="ServerAddress"
              name="ServerAddress"
              value={inputs.ServerAddress || ''}
              onChange={handleInputChange}
              label={t('serverAddress')}
              placeholder={placeholder || "e.g.：https://yourdomain.com"}
              disabled={loading}
            />
          </FormControl>
        </Grid>
        <Grid xs={12}>
          <Button variant="contained" onClick={() => handleSubmit('ServerAddress', inputs.ServerAddress)}>
            {t('updateServerAddress')}
          </Button>
        </Grid>
      </Grid>
    </SubCard>
  );
};

GeneralSetting.propTypes = {
  title: PropTypes.string,
  placeholder: PropTypes.string
};

export default GeneralSetting;