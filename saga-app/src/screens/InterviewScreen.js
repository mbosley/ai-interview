import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const InterviewScreen = ({ navigate, interviewType }) => {
  const { t } = useTranslation();
  const [isAISpeaking, setIsAISpeaking] = useState(true);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [muted, setMuted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showCalendarSync, setShowCalendarSync] = useState(false);
  const [answering, setAnswering] = useState(false);
  
  // Use effect to simulate AI speaking
  useEffect(() => {
    setIsAISpeaking(true);
    const timer = setTimeout(() => {
      setIsAISpeaking(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [questionIndex]);
  
  const questions = [
    "Could you tell me about a time when you had to make a difficult ethical decision? What values guided your choice?",
    "How do you weigh competing priorities when making important decisions in your life?",
    "What role does empathy play in your decision-making process?"
  ];
  
  const handleNextQuestion = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
      setAnswering(false);
    } else {
      navigate('interview-complete');
    }
  };
  
  const startAnswering = () => {
    setAnswering(true);
  };
  
  const CalendarSyncModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-sm">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sync with Calendar</h3>
          <p className="text-sm text-gray-600 mb-4">
            Add this interview to your calendar to receive reminders.
          </p>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-800 text-xs">G</span>
              </div>
              <span className="text-sm">Google Calendar</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-800 text-xs">A</span>
              </div>
              <span className="text-sm">Apple Calendar</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-800 text-xs">O</span>
              </div>
              <span className="text-sm">Outlook</span>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button 
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              onClick={() => setShowCalendarSync(false)}
            >
              Cancel
            </button>
            <button 
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded"
              onClick={() => {
                alert('Interview added to calendar!');
                setShowCalendarSync(false);
              }}
            >
              Add to Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-[640px] bg-white font-sans">
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <button className="text-gray-800" onClick={() => navigate('dashboard')}>
          <span className="mr-1">←</span> {t('dashboard')}
        </button>
        <div className="text-sm text-gray-500 font-light">12:45</div>
        <div className="text-sm text-gray-500 font-light">{questionIndex + 1} of 8</div>
      </div>
      <div className="flex-1 flex flex-col pt-12 px-6">
        <div className="mb-8 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <span className="text-2xl text-gray-400 font-light">AI</span>
          </div>
          <div className="flex space-x-1 mb-6">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <div
                key={i}
                className={`w-1 h-8 rounded-full ${isAISpeaking ? 'animate-pulse' : 'opacity-0'} transition-opacity duration-500`}
                style={{
                  height: `${6 + Math.floor(Math.random() * 10)}px`,
                  backgroundColor: '#000'
                }}
              />
            ))}
          </div>
        </div>
        <div className="bg-gray-100 rounded-2xl p-4 mb-6 max-w-md mx-auto">
          <p className="text-base text-gray-800 leading-relaxed">
            {questions[questionIndex]}
          </p>
        </div>
        {showSubtitles && (
          <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 max-w-md mx-auto">
            <p className="text-base text-gray-600 italic leading-relaxed">
              "I had to decide whether to report a colleague's mistake that could have had serious consequences..."
            </p>
          </div>
        )}
        <div className="flex items-center justify-center mb-12">
          {!answering ? (
            <button 
              className="flex items-center space-x-3 bg-blue-600 text-white rounded-full px-6 py-3"
              onClick={startAnswering}
            >
              <div className="w-3 h-3 rounded-full bg-white"></div>
              <span>Tap to respond</span>
            </button>
          ) : (
            <div className="flex items-center space-x-3 bg-red-50 rounded-full px-4 py-2">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-sm text-gray-500">Recording your response</span>
            </div>
          )}
        </div>
      </div>
      <div className="px-6 py-6 border-t border-gray-100">
        <div className="flex justify-around mb-1">
          <button className="flex flex-col items-center" onClick={() => setMuted(!muted)}>
            <div className={`w-10 h-10 rounded-full ${muted ? 'bg-red-50' : 'bg-gray-50'} flex items-center justify-center mb-1`}>
              <span className={`text-lg ${muted ? 'text-red-600' : 'text-gray-400'}`}>{muted ? '🔇' : '🔊'}</span>
            </div>
            <span className="text-xs text-gray-500">{muted ? 'Unmute' : 'Mute'}</span>
          </button>
          <button className="flex flex-col items-center" onClick={() => setShowSubtitles(!showSubtitles)}>
            <div className={`w-10 h-10 rounded-full ${showSubtitles ? 'bg-gray-100' : 'bg-gray-50'} flex items-center justify-center mb-1`}>
              <span className={`text-sm ${showSubtitles ? 'text-gray-900' : 'text-gray-400'}`}>CC</span>
            </div>
            <span className="text-xs text-gray-500">{showSubtitles ? 'Hide CC' : 'Show CC'}</span>
          </button>
          <button className="flex flex-col items-center" onClick={() => setShowCalendarSync(true)}>
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-1">
              <span className="text-lg text-gray-400">📅</span>
            </div>
            <span className="text-xs text-gray-500">Calendar</span>
          </button>
        </div>
        <button
          className={`mt-6 w-full ${answering ? 'bg-blue-600 text-white' : 'border border-gray-200 text-red-600'} font-normal py-3 px-4 rounded-md transition-all duration-150`}
          onClick={() => answering ? handleNextQuestion() : navigate('dashboard')}
        >
          {answering ? 'Submit & Continue' : 'End interview'}
        </button>
      </div>
      
      {showCalendarSync && <CalendarSyncModal />}
    </div>
  );
};

export default InterviewScreen;
