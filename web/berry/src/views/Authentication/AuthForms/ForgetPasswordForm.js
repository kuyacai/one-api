import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Turnstile from "react-turnstile";
import { API } from "utils/api";
import { useTranslation } from 'react-i18next';

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

// project imports
import AnimateButton from "ui-component/extended/AnimateButton";

// assets
import { showError, showInfo, showSuccess } from "utils/common";

// ===========================|| FIREBASE - REGISTER ||=========================== //

const ForgetPasswordForm = ({ ...others }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const siteInfo = useSelector((state) => state.siteInfo);

  const [sendEmail, setSendEmail] = useState(false);
  const [turnstileEnabled, setTurnstileEnabled] = useState(false);
  const [turnstileSiteKey, setTurnstileSiteKey] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const submit = async (values, { setSubmitting }) => {
    setDisableButton(true);
    setSubmitting(true);
    if (turnstileEnabled && turnstileToken === "") {
      showInfo(t('checkingUserEnvironment'));
      setSubmitting(false);
      return;
    }
    const res = await API.get(
      `/api/reset_password?email=${values.email}&turnstile=${turnstileToken}`
    );
    const { success, message } = res.data;
    if (success) {
      showSuccess(t('resetEmailSentSuccessfullyPleaseCheckYourInbox'));
      setSendEmail(true);
    } else {
      showError(message);
      setDisableButton(false);
      setCountdown(30);
    }
    setSubmitting(false);
  };

  useEffect(() => {
    let countdownInterval = null;
    if (disableButton && countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setDisableButton(false);
      setCountdown(30);
    }
    return () => clearInterval(countdownInterval);
  }, [disableButton, countdown]);

  useEffect(() => {
    if (siteInfo.turnstile_check) {
      setTurnstileEnabled(true);
      setTurnstileSiteKey(siteInfo.turnstile_site_key);
    }
  }, [siteInfo]);

  return (
    <>
      {sendEmail ? (
        <Typography variant="h3" padding={"20px"}>
          {t('resetEmailSentSuccessfullyPleaseCheckYourInbox')}
        </Typography>
      ) : (
        <Formik
          initialValues={{
            email: "",
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email(t('mustBeAValidEmailAddress'))
              .max(255)
              .required(t('emailIsRequired')),
          })}
          onSubmit={submit}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values,
          }) => (
            <form noValidate onSubmit={handleSubmit} {...others}>
              <FormControl
                fullWidth
                error={Boolean(touched.email && errors.email)}
                sx={{ ...theme.typography.customInput }}
              >
                <InputLabel htmlFor="outlined-adornment-email-register">
                  Email
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-email-register"
                  type="text"
                  value={values.email}
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  inputProps={{}}
                />
                {touched.email && errors.email && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text--register"
                  >
                    {errors.email}
                  </FormHelperText>
                )}
              </FormControl>

              {turnstileEnabled ? (
                <Turnstile
                  sitekey={turnstileSiteKey}
                  onVerify={(token) => {
                    setTurnstileToken(token);
                  }}
                />
              ) : (
                <></>
              )}

              <Box sx={{ mt: 2 }}>
                <AnimateButton>
                  <Button
                    disableElevation
                    disabled={isSubmitting || disableButton}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    {t('loginWithGitHub')}
                    {disableButton ? `t('retry') (${countdown})` : t('submit')}
                  </Button>
                </AnimateButton>
              </Box>
            </form>
          )}
        </Formik>
      )}
    </>
  );
};

export default ForgetPasswordForm;
