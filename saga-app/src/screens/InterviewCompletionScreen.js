import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const InterviewCompletionScreen = ({ navigate, interviewType }) => {
  const { t } = useTranslation();
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  
  const handleAddFeedback = () => {
    setShowFeedbackForm(true);
  };
  
  const handleSubmitFeedback = () => {
    alert('Thank you for your feedback!');
    setShowFeedbackForm(false);
  };
  
  const FeedbackForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm">
        <div className="p-6">
          <h3 className="text-lg font-normal text-gray-900 mb-4">Your Feedback</h3>
          
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-2">Rate your experience</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="text-2xl"
                >
                  {star <= rating ? '★' : '☆'}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-2">Comments</label>
            <textarea
              className="w-full p-2 border border-gray-200"
              rows="4"
              placeholder="Share your experience with this interview..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            ></textarea>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button 
              className="px-4 py-2 text-sm text-gray-600"
              onClick={() => setShowFeedbackForm(false)}
            >
              {t('cancel')}
            </button>
            <button 
              className="px-4 py-2 text-sm bg-black text-white"
              onClick={handleSubmitFeedback}
            >
              {t('submit')}
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
        <div className="text-xs uppercase tracking-wider text-gray-500">Interview Complete</div>
        <div className="w-6"></div>
      </div>
      <div className="pt-10 pb-8 px-6 text-center border-b border-gray-100">
        <div className="w-16 h-16 mx-auto bg-gray-50 flex items-center justify-center mb-6">
          <span className="text-2xl">✓</span>
        </div>
        <h1 className="text-2xl font-normal text-gray-900 mb-3">Interview completed</h1>
        <p className="text-base text-gray-500">
          Thank you for sharing your thoughts on ethics and decision-making.
        </p>
      </div>
      <div className="px-6 py-6 border-b border-gray-100">
        <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-2">Payment Summary</h2>
        <div className="text-2xl font-normal text-gray-900 mb-4">$15.00</div>
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Interview type</span>
            <span className="text-gray-800">{interviewType || "Ethics & Values"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Duration</span>
            <span className="text-gray-800">18 minutes</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Status</span>
            <span className="text-gray-800">Payment confirmed</span>
          </div>
        </div>
        <div className="pt-4 border-t border-gray-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Added to balance</span>
            <span className="text-gray-800">Jul 28, 2024</span>
          </div>
        </div>
      </div>
      <div className="px-6 py-6 border-b border-gray-100">
        <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-3">Your Contribution</h2>
        <p className="text-sm text-gray-600 mb-4">
          Your insights will help develop AI systems that better understand complex ethical reasoning and human values.
        </p>
        <div className="bg-gray-50 p-4 mb-6">
          <div className="flex items-start mb-1">
            <div className="w-8 h-8 bg-gray-200 flex items-center justify-center mr-3 flex-shrink-0">
              <span className="text-xs text-gray-500">AI</span>
            </div>
            <p className="text-sm text-gray-800">Thank you for your thoughtful responses. Is there anything about this interview experience you'd like to share with us?</p>
          </div>
        </div>
        <button 
          className="w-full bg-white text-gray-800 font-normal text-base py-3.5 px-4 border border-gray-200"
          onClick={handleAddFeedback}
        >
          Add feedback
        </button>
      </div>
      <div className="px-6 py-6">
        <div className="space-y-3">
          <button
            className="w-full bg-black text-white font-normal text-base py-3.5 px-4"
            onClick={() => navigate('dashboard')}
          >
            Find more interviews
          </button>
          <button
            className="w-full bg-white text-gray-800 font-normal text-base py-3.5 px-4 border border-gray-200"
            onClick={() => navigate('earnings-details')}
          >
            View earnings details
          </button>
        </div>
      </div>
      
      {showFeedbackForm && <FeedbackForm />}
    </div>
  );
};

export default InterviewCompletionScreen;
