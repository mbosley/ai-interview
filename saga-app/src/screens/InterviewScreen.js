import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../context/UserContext';
import AudioRecorder from '../utils/audioRecorder';
import { saveInterviewResponse, completeInterview } from '../utils/firebase';
import { 
  IoMicOutline, 
  IoTextOutline, 
  IoTimeOutline, 
  IoCloseOutline, 
  IoPlayOutline,
  IoPauseOutline,
  IoVolumeHighOutline, 
  IoVolumeMuteOutline,
  IoRefreshOutline,
  IoChevronBackOutline,
  IoCheckmarkCircleOutline,
  IoSendOutline,
  IoCalendarOutline,
  IoWarningOutline
} from 'react-icons/io5';

// Sample questions for the interview
const questions = [
  "Can you share a time when you had to make an ethical decision? What factors influenced your choice?",
  "Tell me about a situation where you had to consider different perspectives before making a decision.",
  "What values are most important to you when making difficult choices?",
  "Describe a moment when you had to prioritize between competing values or principles.",
  "How do you approach situations where there isn't a clear right or wrong answer?",
  "Can you recall an instance where your personal values conflicted with expectations from others?",
  "How do you think AI should be guided by ethical principles in decision-making?",
  "What role does empathy play in your ethical reasoning process?",
];

const TOTAL_QUESTIONS = questions.length;

const InterviewScreen = ({ navigate, interviewType }) => {
  const { t } = useTranslation();
  const { currentUser, userData } = useUser();
  const [isAISpeaking, setIsAISpeaking] = useState(true);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [muted, setMuted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showCalendarSync, setShowCalendarSync] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [answering, setAnswering] = useState(false);
  const [recordingPermissionGranted, setRecordingPermissionGranted] = useState(false);
  const [recordingError, setRecordingError] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const [responseMode, setResponseMode] = useState('choice'); // 'choice', 'audio', or 'text'
  const [textResponse, setTextResponse] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savingError, setSavingError] = useState(null);
  const [countdownValue, setCountdownValue] = useState(0);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingTimer, setRecordingTimer] = useState(null);
  const [recordingStartTime, setRecordingStartTime] = useState(null);
  
  const audioRecorder = useRef(new AudioRecorder());
  const audioPlayer = useRef(new Audio());
  
  useEffect(() => {
    // Clean up audio recorder when component unmounts
    return () => {
      if (audioRecorder.current) {
        audioRecorder.current.cleanup();
      }
    };
  }, []);
  
  // Use effect to simulate AI speaking
  useEffect(() => {
    setIsAISpeaking(true);
    
    // Calculate dynamic duration based on question length
    const questionText = questions[questionIndex];
    const speakingDuration = Math.max(3000, Math.min(8000, questionText.length * 50));
    
    // Add keyframe animation to document head
    if (!document.getElementById('pulse-animation')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'pulse-animation';
      styleEl.textContent = `
        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 0.8; }
          100% { transform: scale(0.9); opacity: 0.6; }
        }
      `;
      document.head.appendChild(styleEl);
    }
    
    const timer = setTimeout(() => {
      setIsAISpeaking(false);
    }, speakingDuration);
    
    return () => clearTimeout(timer);
  }, [questionIndex]);
  
  // Add effect for audio playback
  useEffect(() => {
    if (audioUrl) {
      audioPlayer.current.src = audioUrl;
      
      // Setup event listeners for playback state
      audioPlayer.current.onended = () => {
        setIsPlayingBack(false);
      };
      
      audioPlayer.current.onplay = () => {
        setIsPlayingBack(true);
      };
      
      audioPlayer.current.onpause = () => {
        setIsPlayingBack(false);
      };
      
      // Add animation for visualizer update
      const updateVisualizer = () => {
        if (isPlayingBack) {
          // This would trigger a re-render to update the visualizer
          setIsPlayingBack(true);
        }
        
        if (audioPlayer.current.currentTime < audioPlayer.current.duration) {
          requestAnimationFrame(updateVisualizer);
        }
      };
      
      if (isPlayingBack) {
        requestAnimationFrame(updateVisualizer);
      }
    }
    
    return () => {
      if (audioPlayer.current) {
        audioPlayer.current.onended = null;
        audioPlayer.current.onplay = null;
        audioPlayer.current.onpause = null;
      }
    };
  }, [audioUrl, isPlayingBack]);
  
  const startAnswering = async () => {
    try {
      // In a real app, this would request microphone permission
      setRecordingPermissionGranted(true);
      
      // Start countdown
      setCountdownValue(3);
      const countdownInterval = setInterval(() => {
        setCountdownValue(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Actual recording starts after countdown
      setTimeout(async () => {
        try {
          setAnswering(true);
          await audioRecorder.current.startRecording();
          
          // Start recording timer
          const startTime = Date.now();
          setRecordingStartTime(startTime);
          
          const interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            setRecordingDuration(elapsed);
          }, 1000);
          
          setRecordingTimer(interval);
          
        } catch (error) {
          console.error('Failed to start recording:', error);
          setRecordingError('Could not access microphone. Please ensure you have granted microphone permissions.');
          setAnswering(false);
        }
      }, 3000);
      
    } catch (error) {
      console.error('Permission error:', error);
      setRecordingError('Microphone permission denied. Please allow microphone access to proceed.');
    }
  };
  
  const stopAnswering = async () => {
    try {
      // Clear the recording timer
      if (recordingTimer) {
        clearInterval(recordingTimer);
        setRecordingTimer(null);
      }
      
      const audioBlob = await audioRecorder.current.stopRecording();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      setAnswering(false);
      
    } catch (error) {
      console.error('Failed to stop recording:', error);
      setRecordingError('There was an error stopping the recording. Please try again.');
      setAnswering(false);
    }
  };
  
  const playRecording = () => {
    audioPlayer.current.play();
    setIsPlayingBack(true);
  };
  
  const stopPlayback = () => {
    audioPlayer.current.pause();
    audioPlayer.current.currentTime = 0;
    setIsPlayingBack(false);
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const handleNextQuestion = async () => {
    setIsSaving(true);
    
    try {
      // In a real app, this would save the recording or text to your backend
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network request
      
      // Simulate saving to Firebase
      let responseData = {};
      
      if (responseMode === 'audio') {
        responseData = {
          type: 'audio',
          duration: audioPlayer.current.duration || recordingDuration,
          // In a real app, you'd upload the audio file and get a URL
          audioUrl: 'https://example.com/recording.mp3',
          timestamp: new Date().toISOString()
        };
      } else if (responseMode === 'text') {
        responseData = {
          type: 'text',
          content: textResponse,
          timestamp: new Date().toISOString(),
          wordCount: textResponse.split(/\s+/).filter(Boolean).length
        };
      }
      
      // Simulated progress animation before moving to next question
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulated API call to save the response
      // await saveInterviewResponse(currentUser.uid, interviewType, questionIndex, responseData);
      
      if (questionIndex < TOTAL_QUESTIONS - 1) {
        // Move to next question with slight delay for smooth transition
        setQuestionIndex(prev => prev + 1);
        // Reset response state
        setResponseMode('choice');
        setTextResponse('');
        setAudioUrl(null);
        setRecordingDuration(0);
        
        // Scroll to top for next question with smooth animation
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Show a micro-animation before completing
        await new Promise(resolve => setTimeout(resolve, 800));
        // Interview complete
        // await completeInterview(currentUser.uid, interviewType);
        navigate('interview-complete', { interviewType });
      }
    } catch (error) {
      console.error('Error saving response:', error);
      setSavingError('Failed to save your response. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Minimalist calendar sync modal
  const CalendarSyncModal = () => (
    <div className="fixed inset-0 bg-white z-40 flex flex-col">
      <div className="border-b border-gray-100 p-4 flex justify-between items-center">
        <h3 className="text-base text-gray-900">Add to Calendar</h3>
        <button 
          onClick={() => setShowCalendarSync(false)}
          className="text-gray-400"
        >
          <IoCloseOutline size={20} />
        </button>
      </div>
      
      <div className="p-5 flex-1 overflow-auto">
        <div className="space-y-6">
          <button className="w-full flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center">
              <span className="mr-4 text-gray-500">G</span>
              <span className="text-sm">Google Calendar</span>
            </div>
            <IoChevronBackOutline size={16} className="transform rotate-180 text-gray-400" />
          </button>
          
          <button className="w-full flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center">
              <span className="mr-4 text-gray-500">O</span>
              <span className="text-sm">Outlook</span>
            </div>
            <IoChevronBackOutline size={16} className="transform rotate-180 text-gray-400" />
          </button>
          
          <button className="w-full flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center">
              <span className="mr-4 text-gray-500">A</span>
              <span className="text-sm">Apple Calendar</span>
            </div>
            <IoChevronBackOutline size={16} className="transform rotate-180 text-gray-400" />
          </button>
        </div>
      </div>
      
      <div className="border-t border-gray-100 p-4">
        <button 
          onClick={() => setShowCalendarSync(false)}
          className="w-full py-3 text-center text-sm text-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
  
  // Minimalist exit confirmation modal
  const ExitConfirmModal = () => (
    <div className="fixed inset-0 bg-white z-40 flex flex-col">
      <div className="p-5 flex-1 flex flex-col justify-center">
        <h3 className="text-lg text-center mb-2">Leave interview?</h3>
        <p className="text-sm text-gray-500 text-center mb-10">
          Your progress will not be saved
        </p>
        
        <div className="space-y-4">
          <button 
            className="w-full py-3 border border-black text-sm"
            onClick={() => navigate('dashboard')}
          >
            Leave
          </button>
          <button 
            className="w-full py-3 text-sm text-gray-500"
            onClick={() => setShowExitConfirm(false)}
          >
            Continue interview
          </button>
        </div>
      </div>
    </div>
  );

  // Add some helpful derived variables for UI states
  const isLastQuestion = questionIndex === TOTAL_QUESTIONS - 1;
  const canSubmitResponse = (responseMode === 'audio' && audioUrl) || 
                           (responseMode === 'text' && textResponse.trim().length > 0);
  const progress = ((questionIndex + 1) / TOTAL_QUESTIONS) * 100;
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans animate-fadeIn">
      {/* Elegant header */}
      <div className="bg-white sticky top-0 z-30">
        <div className="flex justify-between items-center px-8 py-6">
          <button 
            className="text-gray-800 flex items-center transition-colors"
            onClick={() => setShowExitConfirm(true)}
          >
            <IoChevronBackOutline size={16} className="mr-1" />
            <span className="text-xs uppercase tracking-[0.15em]">{t('dashboard')}</span>
          </button>
          
          <div className="flex flex-col items-center">
            <div className="text-xs uppercase tracking-[0.15em] text-gray-900">
              {interviewType || "Interview"}
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="text-xs tracking-wide text-gray-500">
              {questionIndex + 1}/{TOTAL_QUESTIONS}
            </div>
          </div>
        </div>
      </div>
      
      {/* Elegant progress bar */}
      <div className="bg-white px-8 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs uppercase tracking-[0.15em] text-gray-400">
            {Math.ceil((TOTAL_QUESTIONS - questionIndex) * 2)} min remaining
          </div>
        </div>
        <div className="h-px bg-gray-100 w-full">
          <div 
            className="h-px bg-black transition-all duration-700" 
            style={{ width: `${((questionIndex + 1) / TOTAL_QUESTIONS) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col py-4 px-4">
        <div className="flex mb-6">
          {/* Pulsing colorful AI orb */}
          <div className="w-1/3 flex justify-center items-start pt-2">
            <div className="flex flex-col items-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center relative overflow-hidden"
                style={{ 
                  background: isAISpeaking 
                    ? 'radial-gradient(circle, rgba(23,23,23,1) 0%, rgba(0,0,0,1) 100%)' 
                    : 'radial-gradient(circle, rgba(30,30,30,1) 0%, rgba(10,10,10,1) 100%)'
                }}
              >
                <span className="text-sm text-white font-thin tracking-wide z-10">AI</span>
                
                {/* Colorful animated effects */}
                {isAISpeaking && (
                  <>
                    <div 
                      className="absolute w-full h-full"
                      style={{
                        background: 'radial-gradient(circle, rgba(100,100,255,0.12) 0%, transparent 70%)',
                        animation: 'pulse 4s ease-in-out infinite alternate',
                        mixBlendMode: 'overlay',
                      }}
                    ></div>
                    <div 
                      className="absolute w-full h-full"
                      style={{
                        background: 'radial-gradient(circle, rgba(255,100,100,0.08) 30%, transparent 70%)',
                        animation: 'pulse 5s ease-in-out infinite alternate-reverse',
                        mixBlendMode: 'overlay',
                      }}
                    ></div>
                    <div 
                      className="absolute w-full h-full"
                      style={{
                        background: 'radial-gradient(circle, rgba(100,255,200,0.10) 20%, transparent 50%)',
                        animation: 'pulse 6s ease-in-out infinite',
                        mixBlendMode: 'overlay',
                      }}
                    ></div>
                    {/* Animations are defined in a <style> tag in the document head */}
                  </>
                )}
              </div>
              
              {/* Subtle speaking indicator */}
              {isAISpeaking && (
                <div className="text-[10px] uppercase tracking-[0.15em] text-gray-400 mt-2">
                  Speaking
                </div>
              )}
            </div>
          </div>
          
          {/* Elegant question card */}
          <div className="w-2/3 bg-white p-5 max-w-md">
            <div className="mb-3">
              <div className="text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-2">Question {questionIndex + 1}</div>
              <div className="h-px w-12 bg-black"></div>
            </div>
            <p className="text-gray-900 leading-relaxed text-base font-light">
              {questions[questionIndex]}
            </p>
          </div>
        </div>
        
        
        {/* Compact recording error */}
        {recordingError && (
          <div className="mb-4 bg-white border-l border-red-500 p-4 max-w-md mx-auto">
            <div className="flex items-center mb-2">
              <div className="text-red-500 mr-2">
                <IoWarningOutline size={14} />
              </div>
              <div className="text-[10px] uppercase tracking-[0.15em]">Microphone Error</div>
            </div>
            <div className="text-gray-500 text-sm font-light mb-3">
              {recordingError}
            </div>
            <div className="flex space-x-3">
              <button 
                className="px-3 py-2 text-[10px] uppercase tracking-[0.10em] text-gray-600 border border-gray-100 hover:border-gray-300 transition-colors"
                onClick={() => setResponseMode('text')}
              >
                Text Mode
              </button>
              <button 
                className="px-3 py-2 text-[10px] uppercase tracking-[0.10em] bg-black text-white hover:bg-gray-900 transition-colors"
                onClick={() => setRecordingError(null)}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
        
        {/* Elegant countdown display */}
        {countdownValue > 0 && (
          <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-95 z-50">
            <div className="text-center">
              <div className="mb-6">
                <span className="text-9xl font-thin text-gray-900 tracking-tight">{countdownValue}</span>
              </div>
              <div className="text-xs uppercase tracking-[0.15em] text-gray-400">
                Recording will begin shortly
              </div>
            </div>
          </div>
        )}
        
        {/* Response area */}
        <div className="flex-1 flex items-center justify-center mb-6">
          {/* Compact mode selection */}
          {responseMode === 'choice' && (
            <div className="bg-white p-5 max-w-md w-full mx-auto">
              <h3 className="text-sm font-light text-gray-800 mb-4">How would you like to respond?</h3>
              <div className="space-y-3">
                <button 
                  className="w-full flex items-center justify-between border-b border-gray-100 pb-3 hover:border-gray-300 transition-colors px-2"
                  onClick={() => setResponseMode('audio')}
                >
                  <div className="flex items-center">
                    <IoMicOutline size={16} className="text-gray-800 mr-3" />
                    <div className="text-left">
                      <span className="text-sm font-light">Voice response</span>
                    </div>
                  </div>
                  <div className="w-4 h-4 border border-gray-900 flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-900"></div>
                  </div>
                </button>
                <button 
                  className="w-full flex items-center justify-between px-2"
                  onClick={() => setResponseMode('text')}
                >
                  <div className="flex items-center">
                    <IoTextOutline size={16} className="text-gray-800 mr-3" />
                    <div className="text-left">
                      <span className="text-sm font-light">Text response</span>
                    </div>
                  </div>
                  <div className="w-4 h-4 border border-gray-200"></div>
                </button>
              </div>
              
              <div className="mt-5 border-t border-gray-100 pt-3 text-center">
                <button
                  className="text-[10px] uppercase tracking-[0.1em] text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setRecordingError("For a real version, microphone permissions would be requested here.")}
                >
                  Microphone not working?
                </button>
              </div>
            </div>
          )}
          
          {/* Compact audio recording UI */}
          {responseMode === 'audio' && (
            <div className="bg-white p-4 max-w-md w-full mx-auto">
              <div className="flex justify-between items-center mb-3">
                <button
                  className="text-gray-800 flex items-center"
                  onClick={() => setResponseMode('choice')}
                >
                  <IoChevronBackOutline size={14} className="mr-1" />
                  <span className="text-xs">Back</span>
                </button>
                {recordingDuration > 0 && !answering && !audioUrl && (
                  <div className="text-xs text-gray-500">
                    {formatTime(recordingDuration)}
                  </div>
                )}
              </div>
              
              {!answering && !audioUrl ? (
                <div className="flex flex-col items-center py-3">
                  <div className="mb-4 text-center">
                    <p className="text-xs text-gray-500 max-w-xs mx-auto">
                      Tap to record your answer
                    </p>
                  </div>
                  
                  <button 
                    className="w-14 h-14 flex items-center justify-center bg-black text-white mb-3"
                    onClick={startAnswering}
                  >
                    <IoMicOutline size={20} />
                  </button>
                  
                  <div className="text-[10px] text-gray-400 text-center">
                    30-60 seconds recommended
                  </div>
                </div>
              ) : answering ? (
                <div className="flex flex-col items-center py-2">
                  <div className="w-full p-3 border border-red-500 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse mr-2"></div>
                        <span className="text-xs text-red-500">Recording</span>
                      </div>
                      <div className="text-xs">
                        {formatTime(recordingDuration)}
                      </div>
                    </div>
                    
                    {/* Compact recording visualization */}
                    <div className="h-6 flex items-end space-x-0.5">
                      {Array.from({ length: 50 }).map((_, i) => (
                        <div 
                          key={i}
                          className="grow bg-black transition-all duration-300"
                          style={{ 
                            height: `${1 + Math.sin((i + Date.now() / 100) * 0.2) * 5}px`,
                            opacity: 0.1 + Math.sin((i + Date.now() / 100) * 0.2) * 0.05,
                            transitionDelay: `${i * 3}ms`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <button 
                    onClick={stopAnswering}
                    className="flex items-center justify-center bg-red-500 w-12 h-12"
                  >
                    <span className="w-3 h-3 bg-white"></span>
                  </button>
                </div>
              ) : audioUrl ? (
                <div className="flex flex-col items-center py-2">                  
                  <div className="w-full border-b border-gray-200 pb-3 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs text-gray-800">Recording complete</div>
                      <div className="text-[10px] text-gray-500">
                        {audioPlayer.current.duration ? 
                          formatTime(Math.floor(audioPlayer.current.duration)) : 
                          formatTime(recordingDuration)}
                      </div>
                    </div>
                    
                    {/* Compact audio waveform */}
                    <div className="h-6 w-full flex items-end space-x-px">
                      {Array.from({ length: 60 }).map((_, i) => (
                        <div 
                          key={i}
                          className="grow transition-all duration-300"
                          style={{ 
                            height: `${1 + Math.sin(i * 0.2) * 5}px`,
                            backgroundColor: 'rgb(23,23,23)',
                            opacity: isPlayingBack && (i / 60) < (audioPlayer.current.currentTime / audioPlayer.current.duration || 0.5) ? 0.9 : 0.15,
                            transform: isPlayingBack && (i / 60) < (audioPlayer.current.currentTime / audioPlayer.current.duration || 0.5) ? 'scaleY(1.1)' : 'scaleY(1)',
                            transitionDelay: `${i * 2}ms`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    {isPlayingBack ? (
                      <button 
                        onClick={stopPlayback}
                        className="flex flex-col items-center"
                      >
                        <div className="flex items-center justify-center w-10 h-10 border border-black">
                          <span className="w-3 h-3 bg-black"></span>
                        </div>
                        <span className="text-[10px] text-gray-600 mt-1">Stop</span>
                      </button>
                    ) : (
                      <button 
                        onClick={playRecording}
                        className="flex flex-col items-center"
                      >
                        <div className="flex items-center justify-center w-10 h-10 border border-black">
                          <IoPlayOutline size={16} className="ml-0.5" />
                        </div>
                        <span className="text-[10px] text-gray-600 mt-1">Play</span>
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        setAudioUrl(null);
                        startAnswering();
                      }}
                      className="flex flex-col items-center"
                    >
                      <div className="flex items-center justify-center w-10 h-10 border border-gray-300">
                        <IoRefreshOutline size={16} className="text-gray-500" />
                      </div>
                      <span className="text-[10px] text-gray-600 mt-1">Re-record</span>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}
          
          {/* Compact text response UI */}
          {responseMode === 'text' && (
            <div className="bg-white p-4 max-w-md w-full mx-auto">
              <div className="flex justify-between items-center mb-3">
                <button
                  className="text-gray-800 flex items-center"
                  onClick={() => setResponseMode('choice')}
                >
                  <IoChevronBackOutline size={14} className="mr-1" />
                  <span className="text-xs">Back</span>
                </button>
              </div>
              
              <div className="w-full mb-2">
                <textarea
                  value={textResponse}
                  onChange={(e) => setTextResponse(e.target.value)}
                  placeholder="Type your response here..."
                  className="w-full h-32 p-3 resize-none focus:outline-none border border-gray-200 text-gray-800 text-sm"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <div>
                    {textResponse.split(/\s+/).filter(Boolean).length} words
                  </div>
                  <div>
                    {textResponse.length} characters
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Streamlined footer */}
      <div className="border-t border-gray-100 bg-white py-4">
        
        
        {savingError && (
          <div className="mx-5 mb-4 border-l-2 border-red-500 p-4">
            <div className="flex items-center mb-2">
              <div className="text-red-500 mr-2">
                <IoWarningOutline size={16} />
              </div>
              <div className="text-sm">Error Saving Response</div>
            </div>
            <div className="text-xs text-gray-600 mb-3">
              {savingError}
            </div>
            <div className="flex space-x-3 justify-end">
              <button 
                className="px-3 py-1.5 text-xs border border-gray-200"
                onClick={() => setSavingError(null)}
              >
                Retry
              </button>
              <button 
                className="px-3 py-1.5 text-xs bg-black text-white"
                onClick={() => setSavingError(null)}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
        
        <div className="px-5">
          <button
            className={`w-full py-3 transition-all flex items-center justify-center ${
              isSaving ? 'bg-gray-100 text-gray-500' : 
              canSubmitResponse ? 'bg-black text-white' : 
              (responseMode === 'audio' && answering) ? 'bg-gray-100 text-gray-400' : 
              responseMode === 'choice' ? 'hidden' :
              'border border-gray-200 text-gray-500'
            }`}
            onClick={() => {
              if (isSaving) return;
              
              if ((responseMode === 'audio' && audioUrl) || (responseMode === 'text' && textResponse.trim().length > 0)) {
                handleNextQuestion();
              } else if (!answering) {
                setShowExitConfirm(true);
              }
            }}
            disabled={
              isSaving || 
              (responseMode === 'audio' && answering) ||
              (responseMode === 'text' && textResponse.trim().length === 0)
            }
          >
            {isSaving ? (
              <span className="flex items-center justify-center">
                <div className="w-3 h-3 rounded-full border-t-2 border-r-2 border-black animate-spin mr-2"></div>
                <span className="text-sm">Saving...</span>
              </span>
            ) : canSubmitResponse ? (
              <span className="text-sm">{isLastQuestion ? 'Submit' : 'Continue'}</span>
            ) : responseMode === 'audio' && answering ? (
              <span className="text-sm">Recording in progress...</span>
            ) : (
              <span className="text-sm">End interview</span>
            )}
          </button>
          
          {/* Minimalist cancel button for "choice" mode */}
          {responseMode === 'choice' && (
            <button
              className="mt-3 w-full py-3 border-t border-gray-100 text-gray-500 text-sm flex items-center justify-center"
              onClick={() => setShowExitConfirm(true)}
            >
              Cancel interview
            </button>
          )}
        </div>
      </div>
      
      {showCalendarSync && <CalendarSyncModal />}
      {showExitConfirm && <ExitConfirmModal />}
    </div>
  );
};

export default InterviewScreen;