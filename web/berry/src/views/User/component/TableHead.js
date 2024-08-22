import { TableCell, TableHead, TableRow } from '@mui/material';
import { useTranslation } from 'react-i18next';

const UsersTableHead = () => {
  const { t } = useTranslation();
  return (
    <TableHead>
      <TableRow>
        <TableCell>ID</TableCell>
        <TableCell>{t('username')}</TableCell>
        <TableCell>{t('group')}</TableCell>
        <TableCell>{t('statistics')}</TableCell>
        <TableCell>{t('userRole')}</TableCell>
        <TableCell>{t('binding')}</TableCell>
        <TableCell>{t('status')}</TableCell>
        <TableCell>{t('actions')}</TableCell>
      </TableRow>
    </TableHead>
  );
};

export default UsersTableHead;