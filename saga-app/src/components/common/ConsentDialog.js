import React from 'react';
import { useTranslation } from 'react-i18next';

const ConsentDialog = ({ onConsent }) => {
  const { t } = useTranslation();
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
        <h3 className="text-xl font-medium text-gray-900 mb-4">{t('consentTitle')}</h3>
        <p className="text-gray-600 mb-6">
          {t('consentDescription')}
        </p>
        <div className="flex justify-end">
          <button 
            className="bg-gray-200 text-gray-800 mr-3 px-4 py-2 rounded"
            onClick={() => alert("Consent required to use Saga")}
          >
            {t('consentDecline')}
          </button>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={onConsent}
          >
            {t('consentAccept')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentDialog;
