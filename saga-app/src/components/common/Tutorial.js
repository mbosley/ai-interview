import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Tutorial = ({ onComplete }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  
  const steps = [
    { text: t('tutorialStart'), position: 'center' },
    { text: t('tutorialInterviews'), position: 'top' },
    { text: t('tutorialEarnings'), position: 'middle' },
    { text: t('tutorialNavigation'), position: 'bottom' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
      <div 
        className={`bg-white p-4 rounded-lg shadow-lg max-w-sm mx-auto relative ${
          step === 0 ? 'self-center' : 
          step === 1 ? 'self-start mt-32' : 
          step === 2 ? 'self-center' : 
          'self-end mb-20'
        }`}
      >
        <p className="text-gray-800 mb-4">{steps[step].text}</p>
        <div className="flex justify-between">
          {step > 0 && (
            <button 
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm"
              onClick={() => setStep(step - 1)}
            >
              {t('tutorialBack')}
            </button>
          )}
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm ml-auto"
            onClick={() => step < steps.length - 1 ? setStep(step + 1) : onComplete()}
          >
            {step < steps.length - 1 ? t('tutorialNext') : t('tutorialFinish')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
