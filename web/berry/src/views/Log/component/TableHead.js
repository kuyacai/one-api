import PropTypes from 'prop-types';
import { TableCell, TableHead, TableRow } from '@mui/material';
import { useTranslation } from 'react-i18next';
const LogTableHead = ({ userIsAdmin }) => {
  const { t } = useTranslation();
  return (
    <TableHead>
      <TableRow>
        <TableCell>{t('time')}</TableCell>
        {userIsAdmin && <TableCell>{t('channel')}</TableCell>}
        {userIsAdmin && <TableCell>{t('user')}</TableCell>}
        <TableCell>{t('token')}</TableCell>
        <TableCell>{t('type')}</TableCell>
        <TableCell>{t('model')}</TableCell>
        <TableCell>{t('prompt')}</TableCell>
        <TableCell>{t('completion')}</TableCell>
        <TableCell>{t('quota')}</TableCell>
        <TableCell>{t('details')}</TableCell>
      </TableRow>
    </TableHead>
  );
};

export default LogTableHead;

LogTableHead.propTypes = {
  userIsAdmin: PropTypes.bool
};
