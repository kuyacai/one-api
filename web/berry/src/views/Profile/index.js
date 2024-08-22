import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import UserCard from 'ui-component/cards/UserCard';
import {
  Card,
  Button,
  InputLabel,
  FormControl,
  OutlinedInput,
  Stack,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  SvgIcon
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import SubCard from 'ui-component/cards/SubCard';
import { IconBrandWechat, IconBrandGithub, IconMail } from '@tabler/icons-react';
import Label from 'ui-component/Label';
import { API } from 'utils/api';
import { showError, showSuccess } from 'utils/common';
import { onGitHubOAuthClicked, onLarkOAuthClicked, copy } from 'utils/common';
import * as Yup from 'yup';
import WechatModal from 'views/Authentication/AuthForms/WechatModal';
import { useSelector } from 'react-redux';
import EmailModal from './component/EmailModal';
import Turnstile from 'react-turnstile';
import { ReactComponent as Lark } from 'assets/images/icons/lark.svg';

const validationSchema = Yup.object().shape({
  username: Yup.string().required('用户名 不能为空').min(3, '用户名 不能小于 3 个字符'),
  display_name: Yup.string(),
  password: Yup.string().test('password', '密码不能小于 8 个字符', (val) => {
    return !val || val.length >= 8;
  })
});

export default function Profile() {
  const [inputs, setInputs] = useState([]);
  const [showAccountDeleteModal, setShowAccountDeleteModal] = useState(false);
  const [turnstileEnabled, setTurnstileEnabled] = useState(false);
  const [turnstileSiteKey, setTurnstileSiteKey] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [openWechat, setOpenWechat] = useState(false);
  const [openEmail, setOpenEmail] = useState(false);
  const status = useSelector((state) => state.siteInfo);
  const { t } = useTranslation();

  const handleWechatOpen = () => {
    setOpenWechat(true);
  };

  const handleWechatClose = () => {
    setOpenWechat(false);
  };

  const handleInputChange = (event) => {
    let { name, value } = event.target;
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  const loadUser = async () => {
    let res = await API.get(`/api/user/self`);
    const { success, message, data } = res.data;
    if (success) {
      setInputs(data);
    } else {
      showError(message);
    }
  };

  const bindWeChat = async (code) => {
    if (code === '') return;
    try {
      const res = await API.get(`/api/oauth/wechat/bind?code=${code}`);
      const { success, message } = res.data;
      if (success) {
        showSuccess(t('wechatAccountBindingSuccess'));
      }
      return { success, message };
    } catch (err) {
      // 请求失败，设置错误信息
      return { success: false, message: '' };
    }
  };

  const generateAccessToken = async () => {
    const res = await API.get('/api/user/token');
    const { success, message, data } = res.data;
    if (success) {
      setInputs((inputs) => ({ ...inputs, access_token: data }));
      copy(data, t('accessToken'));
    } else {
      showError(message);
    }

    console.log(turnstileEnabled, turnstileSiteKey, status);
  };

  const submit = async () => {
    try {
      await validationSchema.validate(inputs);
      const res = await API.put(`/api/user/self`, inputs);
      const { success, message } = res.data;
      if (success) {
        showSuccess(t('userInfoUpdateSuccess'));
      } else {
        showError(message);
      }
    } catch (err) {
      showError(err.message);
    }
  };

  useEffect(() => {
    if (status) {
      if (status.turnstile_check) {
        setTurnstileEnabled(true);
        setTurnstileSiteKey(status.turnstile_site_key);
      }
    }
    loadUser().then();
  }, [status]);

  return (
    <>
      <UserCard>
        <Card sx={{ paddingTop: '20px' }}>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ paddingBottom: '20px' }}>
              <Label variant="ghost" color={inputs.wechat_id ? 'primary' : 'default'}>
                <IconBrandWechat /> {inputs.wechat_id || t('notBound')}
              </Label>
              <Label variant="ghost" color={inputs.github_id ? 'primary' : 'default'}>
                <IconBrandGithub /> {inputs.github_id || t('notBound')}
              </Label>
              <Label variant="ghost" color={inputs.email ? 'primary' : 'default'}>
                <IconMail /> {inputs.email || t('notBound')}
              </Label>
              <Label variant="ghost" color={inputs.lark_id ? 'primary' : 'default'}>
                <SvgIcon component={Lark} inheritViewBox={true} viewBox={'0 0 24 24'}/> {inputs.lark_id || t('notBound')}
              </Label>
            </Stack>
            <SubCard title={t('personalInfo')}>
              <Grid container spacing={2}>
                <Grid xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="username">{t('username')}</InputLabel>
                    <OutlinedInput
                      id="username"
                      label={t('username')}
                      type="text"
                      value={inputs.username || ''}
                      onChange={handleInputChange}
                      name="username"
                      placeholder={t('enterUsername')}
                    />
                  </FormControl>
                </Grid>
                <Grid xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="password">{t('password')}</InputLabel>
                    <OutlinedInput
                      id="password"
                      label={t('password')}
                      type="password"
                      value={inputs.password || ''}
                      onChange={handleInputChange}
                      name="password"
                      placeholder={t('enterPassword')}
                    />
                  </FormControl>
                </Grid>
                <Grid xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="display_name">{t('displayName')}</InputLabel>
                    <OutlinedInput
                      id="display_name"
                      label={t('displayName')}
                      type="text"
                      value={inputs.display_name || ''}
                      onChange={handleInputChange}
                      name="display_name"
                      placeholder={t('enterDisplayName')}
                    />
                  </FormControl>
                </Grid>
                <Grid xs={12}>
                  <Button variant="contained" color="primary" onClick={submit}>
                    {t('submit')}
                  </Button>
                </Grid>
              </Grid>
            </SubCard>
            <SubCard title={t('accountBinding')}>
              <Grid container spacing={2}>
                {status.wechat_login && !inputs.wechat_id && (
                  <Grid xs={12} md={4}>
                    <Button variant="contained" onClick={handleWechatOpen}>
                      {t('bindWechatAccount')}
                    </Button>
                  </Grid>
                )}
                {status.github_oauth && !inputs.github_id && (
                  <Grid xs={12} md={4}>
                    <Button variant="contained" onClick={() => onGitHubOAuthClicked(status.github_client_id, true)}>
                      {t('bindGitHubAccount')}
                    </Button>
                  </Grid>
                )}
                {status.lark_client_id && !inputs.lark_id && (
                  <Grid xs={12} md={4}>
                    <Button variant="contained" onClick={() => onLarkOAuthClicked(status.lark_client_id)}>
                      {t('bindFeishuAccount')}
                    </Button>
                  </Grid>
                )}
                <Grid xs={12} md={4}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setOpenEmail(true);
                    }}
                  >
                    {inputs.email ? t('changeEmail') : t('bindEmail')}
                  </Button>
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
                </Grid>
              </Grid>
            </SubCard>
            <SubCard title={t('other')}>
              <Grid container spacing={2}>
                <Grid xs={12}>
                  <Alert severity="info">{t('tipsOne')}</Alert>
                </Grid>
                {inputs.access_token && (
                  <Grid xs={12}>
                    <Alert severity="error">
                    {t('yourAccessTokenIs')} <b>{inputs.access_token}</b> <br />
                    {t('keepItSafe')}
                    </Alert>
                  </Grid>
                )}
                <Grid xs={12}>
                  <Button variant="contained" onClick={generateAccessToken}>
                    {inputs.access_token ? t('resetAccessToken') : t('generateAccessToken')}
                  </Button>
                </Grid>

                <Grid xs={12}>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                      setShowAccountDeleteModal(true);
                    }}
                  >
                    {t('deleteAccount')}
                  </Button>
                </Grid>
              </Grid>
            </SubCard>
          </Stack>
        </Card>
      </UserCard>
      <Dialog open={showAccountDeleteModal} onClose={() => setShowAccountDeleteModal(false)} maxWidth={'md'}>
        <DialogTitle sx={{ margin: '0px', fontWeight: 500, lineHeight: '1.55556', padding: '24px', fontSize: '1.125rem' }}>
          {t('dangerousOperation')}
        </DialogTitle>
        <Divider />
        <DialogContent>{t('dangerTips')}</DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAccountDeleteModal(false)}>{t('cancel')}</Button>
          <Button
            sx={{ color: 'error.main' }}
            onClick={async () => {
              setShowAccountDeleteModal(false);
            }}
          >
            {t('confirm')}
          </Button>
        </DialogActions>
      </Dialog>
      <WechatModal open={openWechat} handleClose={handleWechatClose} wechatLogin={bindWeChat} qrCode={status.wechat_qrcode} />
      <EmailModal
        open={openEmail}
        turnstileToken={turnstileToken}
        handleClose={() => {
          setOpenEmail(false);
        }}
      />
    </>
  );
}
