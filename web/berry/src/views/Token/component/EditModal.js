import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTheme } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Autocomplete,
  Checkbox,
  TextField,
  Switch,
  FormHelperText
} from '@mui/material';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { renderQuotaWithPrompt, showSuccess, showError } from 'utils/common';
import { API } from 'utils/api';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { createFilterOptions } from '@mui/material/Autocomplete';
require('dayjs/locale/zh-cn');
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const filter = createFilterOptions();

const validationSchema = Yup.object().shape({
  is_edit: Yup.boolean(),
  name: Yup.string().required(i18n.t('validation.nameRequired')),
  remain_quota: Yup.number().min(0, i18n.t('validation.quotaMin')),
  expired_time: Yup.number(),
  unlimited_quota: Yup.boolean()
});

const originInputs = {
  is_edit: false,
  name: '',
  remain_quota: 0,
  expired_time: -1,
  unlimited_quota: false,
  subnet: '',
  models: []
};

const EditModal = ({ open, tokenId, onCancel, onOk }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [inputs, setInputs] = useState(originInputs);
  const [modelOptions, setModelOptions] = useState([]);

  const submit = async (values, { setErrors, setStatus, setSubmitting }) => {
    setSubmitting(true);

    values.remain_quota = parseInt(values.remain_quota);
    let res;
    let models = values.models.join(',');
    if (values.is_edit) {
      res = await API.put(`/api/token/`, { ...values, id: parseInt(tokenId), models: models });
    } else {
      res = await API.post(`/api/token/`, { ...values, models: models });
    }
    const { success, message } = res.data;
    if (success) {
      if (values.is_edit) {
        showSuccess(t('tokenUpdateSuccess'));
      } else {
        showSuccess(t('tokenCreateSuccess'));
      }
      setSubmitting(false);
      setStatus({ success: true });
      onOk(true);
    } else {
      showError(message);
      setErrors({ submit: message });
    }
  };

  const loadToken = async () => {
    let res = await API.get(`/api/token/${tokenId}`);
    const { success, message, data } = res.data;
    if (success) {
      data.is_edit = true;
      if (data.models === '') {
        data.models = [];
      } else {
        data.models = data.models.split(',');
      }
      setInputs(data);
    } else {
      showError(message);
    }
  };
  const loadAvailableModels = async () => {
    let res = await API.get(`/api/user/available_models`);
    const { success, message, data } = res.data;
    if (success) {
      setModelOptions(data);
    } else {
      showError(message);
    }
  };

  useEffect(() => {
    if (tokenId) {
      loadToken().then();
    } else {
      setInputs({ ...originInputs });
    }
    loadAvailableModels().then();
  }, [tokenId]);

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth={'md'}>
      <DialogTitle
        sx={{
          margin: '0px',
          fontWeight: 700,
          lineHeight: '1.55556',
          padding: '24px',
          fontSize: '1.125rem'
        }}
      >
        {tokenId ? t('editToken') : t('newToken')}
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Alert severity="info">{t('tokenTips')}</Alert>
        <Formik initialValues={inputs} enableReinitialize validationSchema={validationSchema} onSubmit={submit}>
          {({ errors, handleBlur, handleChange, handleSubmit, touched, values, setFieldError, setFieldValue, isSubmitting }) => (
            <form noValidate onSubmit={handleSubmit}>
              <FormControl fullWidth error={Boolean(touched.name && errors.name)} sx={{ ...theme.typography.otherInput }}>
                <InputLabel htmlFor="channel-name-label">{t('name')}</InputLabel>
                <OutlinedInput
                  id="channel-name-label"
                  label={t('name')}
                  type="text"
                  value={values.name}
                  name="name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  inputProps={{ autoComplete: 'name' }}
                  aria-describedby="helper-text-channel-name-label"
                />
                {touched.name && errors.name && (
                  <FormHelperText error id="helper-tex-channel-name-label">
                    {errors.name}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth sx={{ ...theme.typography.otherInput }}>
                <Autocomplete
                  multiple
                  freeSolo
                  id="channel-models-label"
                  options={modelOptions}
                  value={values.models}
                  onChange={(e, value) => {
                    const event = {
                      target: {
                        name: 'models',
                        value: value
                      }
                    };
                    handleChange(event);
                  }}
                  onBlur={handleBlur}
                  // filterSelectedOptions
                  disableCloseOnSelect
                  renderInput={(params) => <TextField {...params} name="models" error={Boolean(errors.models)} label={t('modelScope')} />}
                  filterOptions={(options, params) => {
                    const filtered = filter(options, params);
                    const { inputValue } = params;
                    const isExisting = options.some((option) => inputValue === option);
                    if (inputValue !== '' && !isExisting) {
                      filtered.push(inputValue);
                    }
                    return filtered;
                  }}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                      {option}
                    </li>
                  )}
                />
                {errors.models ? (
                  <FormHelperText error id="helper-tex-channel-models-label">
                    {errors.models}
                  </FormHelperText>
                ) : (
                  <FormHelperText id="helper-tex-channel-models-label">{t('selectAllowedModels')}</FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth error={Boolean(touched.subnet && errors.subnet)} sx={{ ...theme.typography.otherInput }}>
                <InputLabel htmlFor="channel-subnet-label">{t('ipRestriction')}</InputLabel>
                <OutlinedInput
                  id="channel-subnet-label"
                  label={t('ipRestriction')}
                  type="text"
                  value={values.subnet}
                  name="subnet"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  inputProps={{ autoComplete: 'subnet' }}
                  aria-describedby="helper-text-channel-subnet-label"
                />
                {touched.subnet && errors.subnet ? (
                  <FormHelperText error id="helper-tex-channel-subnet-label">
                    {errors.subnet}
                  </FormHelperText>
                ) : (
                  <FormHelperText id="helper-tex-channel-subnet-label">
                    {t('enterAllowedIPRanges')}
                  </FormHelperText>
                )}
              </FormControl>
              {values.expired_time !== -1 && (
                <FormControl fullWidth error={Boolean(touched.expired_time && errors.expired_time)} sx={{ ...theme.typography.otherInput }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'zh-cn'}>
                    <DateTimePicker
                      label={t('expirationTime')}
                      ampm={false}
                      value={dayjs.unix(values.expired_time)}
                      onError={(newError) => {
                        if (newError === null) {
                          setFieldError('expired_time', null);
                        } else {
                          setFieldError('expired_time', t('invalidDate'));
                        }
                      }}
                      onChange={(newValue) => {
                        setFieldValue('expired_time', newValue.unix());
                      }}
                      slotProps={{
                        actionBar: {
                          actions: ['today', 'accept']
                        }
                      }}
                    />
                  </LocalizationProvider>
                  {errors.expired_time && (
                    <FormHelperText error id="helper-tex-channel-expired_time-label">
                      {errors.expired_time}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
              <Switch
                checked={values.expired_time === -1}
                onClick={() => {
                  if (values.expired_time === -1) {
                    setFieldValue('expired_time', Math.floor(Date.now() / 1000));
                  } else {
                    setFieldValue('expired_time', -1);
                  }
                }}
              />{' '}
              {t('neverExpires')}
              <FormControl fullWidth error={Boolean(touched.remain_quota && errors.remain_quota)} sx={{ ...theme.typography.otherInput }}>
                <InputLabel htmlFor="channel-remain_quota-label">{t('quota')}</InputLabel>
                <OutlinedInput
                  id="channel-remain_quota-label"
                  label={t('quota')}
                  type="number"
                  value={values.remain_quota}
                  name="remain_quota"
                  endAdornment={<InputAdornment position="end">{renderQuotaWithPrompt(values.remain_quota)}</InputAdornment>}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  aria-describedby="helper-text-channel-remain_quota-label"
                  disabled={values.unlimited_quota}
                />

                {touched.remain_quota && errors.remain_quota && (
                  <FormHelperText error id="helper-tex-channel-remain_quota-label">
                    {errors.remain_quota}
                  </FormHelperText>
                )}
              </FormControl>
              <Switch
                checked={values.unlimited_quota === true}
                onClick={() => {
                  setFieldValue('unlimited_quota', !values.unlimited_quota);
                }}
              />{' '}
              {t('unlimitedQuota')}
              <DialogActions>
                <Button onClick={onCancel}>{t('cancel')}</Button>
                <Button disableElevation disabled={isSubmitting} type="submit" variant="contained" color="primary">
                  {t('submit')}
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;

EditModal.propTypes = {
  open: PropTypes.bool,
  tokenId: PropTypes.number,
  onCancel: PropTypes.func,
  onOk: PropTypes.func
};
