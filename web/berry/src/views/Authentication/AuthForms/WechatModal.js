// WechatModal.js
import PropTypes from 'prop-types';
import React from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Typography, Grid } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { showError } from 'utils/common';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

const validationSchema = Yup.object().shape({
  code: Yup.string().required(i18n.t('validation.codeRequired'))
});

const WechatModal = ({ open, handleClose, wechatLogin, qrCode }) => {
  const { t } = useTranslation();
  const handleSubmit = (values) => {
    const { success, message } = wechatLogin(values.code);
    if (success) {
      handleClose();
    } else {
      showError(message || t('unknownError'));
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t('wechatVerificationCodeLogin')}</DialogTitle>
      <DialogContent>
        <Grid container direction="column" alignItems="center">
          <img src={qrCode} alt={t('qrCode')} style={{ maxWidth: '300px', maxHeight: '300px', width: 'auto', height: 'auto' }} />
          <Typography
            variant="body2"
            color="text.secondary"
            style={{ marginTop: '10px', textAlign: 'center', wordWrap: 'break-word', maxWidth: '300px' }}
          >
            
            {t('officialWechatVal')}
          </Typography>
          <Formik initialValues={{ code: '' }} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ errors, touched }) => (
              <Form style={{ width: '100%' }}>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="code"
                    label={t('verificationCode')}
                    error={touched.code && Boolean(errors.code)}
                    helperText={touched.code && errors.code}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" fullWidth>
                    
                    {t('submit')}
                  </Button>
                </Grid>
              </Form>
            )}
          </Formik>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default WechatModal;

WechatModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  wechatLogin: PropTypes.func,
  qrCode: PropTypes.string
};
