import { TableCell, TableHead, TableRow } from '@mui/material';
import { useTranslation } from 'react-i18next';

const TokenTableHead = () => {
  const { t } = useTranslation();
  return (
    <TableHead>
      <TableRow>
        <TableCell>{t('name')}</TableCell>
        <TableCell>{t('status')}</TableCell>
        <TableCell>{t('usedQuota')}</TableCell>
        <TableCell>{t('remainingQuota')}</TableCell>
        <TableCell>{t('creationTime')}</TableCell>
        <TableCell>{t('expirationTime')}</TableCell>
        <TableCell>{t('actions')}</TableCell>
      </TableRow>
    </TableHead>
  );
};

export default TokenTableHead;