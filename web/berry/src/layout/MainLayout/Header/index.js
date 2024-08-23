import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, Grid } from '@mui/material';

// project imports
import LogoSection from '../LogoSection';
import ProfileSection from './ProfileSection';
import ThemeButton from 'ui-component/ThemeButton';
import LanguageSwitcher from 'ui-component/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
// assets
import { IconMenu2 } from '@tabler/icons-react';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
  const theme = useTheme();
  const { i18n } = useTranslation();

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  return (
    <>
      <Grid container alignItems="center" spacing={2}>
        <Grid item>
          {/* logo & toggler button */}
          <Box
            sx={{
              width: 228,
              display: 'flex',
              [theme.breakpoints.down('md')]: {
                width: 'auto'
              }
            }}
          >
            <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
              <LogoSection />
            </Box>
            <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden' }}>
              <Avatar
                variant="rounded"
                sx={{
                  ...theme.typography.commonAvatar,
                  ...theme.typography.mediumAvatar,
                  ...theme.typography.menuButton,
                  transition: 'all .2s ease-in-out',
                  '&:hover': {
                    background: theme.palette.secondary.dark,
                    color: theme.palette.secondary.light
                  }
                }}
                onClick={handleLeftDrawerToggle}
                color="inherit"
              >
                <IconMenu2 stroke={1.5} size="1.3rem" />
              </Avatar>
            </ButtonBase>
          </Box>
        </Grid>
        <Grid item xs />
        <Grid item>

          <ThemeButton />
        </Grid>
        <Grid item><LanguageSwitcher changeLanguage={changeLanguage} /></Grid>

        <Grid item><ProfileSection /></Grid>
      </Grid>
    </>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func
};

export default Header;
