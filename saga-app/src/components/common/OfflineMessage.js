import React from 'react';
import { useTranslation } from 'react-i18next';

const OfflineMessage = ({ isOnline }) => {
  const { t } = useTranslation();
  
  if (isOnline) return null;
  
  return (
    <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 text-sm z-50">
      {t('offlineMessage')}
    </div>
  );
};

export default OfflineMessage;
