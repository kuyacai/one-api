import { TableCell, TableHead, TableRow } from '@mui/material';
import { useTranslation } from 'react-i18next';

const RedemptionTableHead = () => {
  const { t } = useTranslation();
  return (
    <TableHead>
      <TableRow>
      <TableCell>{t('id')}</TableCell>
      <TableCell>{t('name')}</TableCell>
      <TableCell>{t('status')}</TableCell>
      <TableCell>{t('quota')}</TableCell>
      <TableCell>{t('creationTime')}</TableCell>
      <TableCell>{t('redemptionTime')}</TableCell>
      <TableCell>{t('actions')}</TableCell>
      </TableRow>
    </TableHead>
  );
};

export default RedemptionTableHead;
