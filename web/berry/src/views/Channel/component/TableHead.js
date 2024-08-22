import { TableCell, TableHead, TableRow } from '@mui/material';
import { useTranslation } from 'react-i18next';
const ChannelTableHead = () => {
  const { t } = useTranslation();
  return (
    <TableHead>
      <TableRow>
        <TableCell>ID</TableCell>
        <TableCell>{t('name')}</TableCell>
        <TableCell>{t('group')}</TableCell>
        <TableCell>{t('type')}</TableCell>
        <TableCell>{t('status')}</TableCell>
        <TableCell>{t('responseTime')}</TableCell>
        <TableCell>{t('consumed')}</TableCell>
        <TableCell>{t('balance')}</TableCell>
        <TableCell>{t('priority')}</TableCell>
        <TableCell>{t('action')}</TableCell>
      </TableRow>
    </TableHead>
  );
};

export default ChannelTableHead;
