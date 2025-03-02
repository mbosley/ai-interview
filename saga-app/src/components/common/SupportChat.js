import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const SupportChat = ({ onClose }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([
    { sender: 'bot', message: 'Hello! How can I help you today?', time: 'Now' }
  ]);
  const [inputText, setInputText] = useState('');
  
  const sendMessage = () => {
    if (!inputText.trim()) return;
    
    // Add user message
    const updatedMessages = [
      ...messages,
      { sender: 'user', message: inputText, time: 'Just now' }
    ];
    setMessages(updatedMessages);
    setInputText('');
    
    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "I'd be happy to help with that!",
        "Thanks for your question. Let me check that for you.",
        "That's a great question. Here's what you need to know...",
        "I understand your concern. Let me explain how it works."
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      setMessages([
        ...updatedMessages,
        { sender: 'bot', message: randomResponse, time: 'Just now' }
      ]);
    }, 1000);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md h-96 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">Support Chat</h3>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-xs p-3 rounded-lg ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm">{msg.message}</p>
                <span className="text-xs opacity-75 block text-right mt-1">{msg.time}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t flex">
          <input
            type="text"
            className="flex-1 border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-r-lg"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportChat;
