import { useTranslation } from 'react-i18next';
import { Stack, Typography, Container, Box, OutlinedInput, InputAdornment, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SubCard from 'ui-component/cards/SubCard';
import inviteImage from 'assets/images/invite/cwok_casual_19.webp';
import { useState } from 'react';
import { API } from 'utils/api';
import { showError, copy } from 'utils/common';

const InviteCard = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [inviteUl, setInviteUrl] = useState('');

  const handleInviteUrl = async () => {
    if (inviteUl) {
      copy(inviteUl, t('invitationLink'));
      return;
    }
    const res = await API.get('/api/user/aff');
    const { success, message, data } = res.data;
    if (success) {
      let link = `${window.location.origin}/register?aff=${data}`;
      setInviteUrl(link);
      copy(link, t('invitationLink'));
    } else {
      showError(message);
    }
  };

  return (
    <Box component="div">
      <SubCard
        sx={{
          background: theme.palette.primary.dark
        }}
      >
        <Stack justifyContent="center" alignItems={'flex-start'} padding={'40px 24px 0px'} spacing={3}>
          <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src={inviteImage} alt="invite" width={'250px'} />
          </Container>
        </Stack>
      </SubCard>
      <SubCard
        sx={{
          marginTop: '-20px'
        }}
      >
        <Stack justifyContent="center" alignItems={'center'} spacing={3}>
          <Typography variant="h3" sx={{ color: theme.palette.primary.dark }}>
            {t('invitationReward')}
          </Typography>
          <Typography variant="body" sx={{ color: theme.palette.primary.dark }}>
            {t('invitationTips')}
          </Typography>

          <OutlinedInput
            id="invite-url"
            label={t('invitationLink')}
            type="text"
            value={inviteUl}
            name="invite-url"
            placeholder={t('clickToGenerateInvitationLink')}
            endAdornment={
              <InputAdornment position="end">
                <Button variant="contained" onClick={handleInviteUrl}>
                  {inviteUl ? t('copy') : t('generate')}
                </Button>
              </InputAdornment>
            }
            aria-describedby="helper-text-channel-quota-label"
            disabled={true}
          />
        </Stack>
      </SubCard>
    </Box>
  );
};

export default InviteCard;
