const axios = require('axios');
const config = require('../config/config');
const logger = require('../utils/logger');

/**
 * Format transcript for OpenAI API input
 * @param {Array} transcript The conversation transcript
 * @returns {Array} Formatted messages for OpenAI API
 */
const formatTranscript = (transcript) => {
  return transcript.map(message => ({
    role: message.sender === 'ai' ? 'assistant' : 'user',
    content: message.text
  }));
};

/**
 * Generate a question using OpenAI's API
 * @param {Object} context Context object with transcript and optional prompt
 * @returns {Promise<string>} The generated question
 */
const generateQuestion = async (context) => {
  try {
    const { 
      transcript, 
      prompt = config.systemPrompts.followUp,
      temperature = config.llmTemperature,
      model = config.llmModel 
    } = context;
    
    const messages = [
      { role: 'system', content: prompt }
    ];
    
    // Add transcript messages if available
    if (transcript && transcript.length > 0) {
      messages.push(...formatTranscript(transcript));
    }
    
    logger.debug(`Using model: ${model}, temperature: ${temperature}`);
    
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: model,
        messages,
        temperature: temperature,
        max_tokens: 150,
        top_p: 1,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.openaiApiKey}`
        }
      }
    );
    
    // Extract and return the generated question
    const generatedText = response.data.choices[0].message.content.trim();
    logger.debug('Generated question:', generatedText);
    
    return generatedText;
  } catch (error) {
    logger.error('OpenAI API error:', error.message);
    throw new Error(`OpenAI API error: ${error.message}`);
  }
};

/**
 * Generate a summary of the interview using OpenAI's API
 * @param {Array} transcript The conversation transcript
 * @param {string} prompt The system prompt for summary generation
 * @param {number} temperature The temperature for generation
 * @param {string} model The model to use
 * @returns {Promise<string>} The generated summary
 */
const generateSummary = async (transcript, prompt = config.systemPrompts.summary, temperature = 0.5, model = config.llmModel) => {
  try {
    const messages = [
      { role: 'system', content: prompt }
    ];
    
    // Add transcript messages
    if (transcript && transcript.length > 0) {
      messages.push(...formatTranscript(transcript));
    }
    
    logger.debug(`Generating summary using model: ${model}, temperature: ${temperature}`);
    
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: model,
        messages,
        temperature: temperature,
        max_tokens: 300,
        top_p: 1,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.openaiApiKey}`
        }
      }
    );
    
    // Extract and return the generated summary
    const generatedSummary = response.data.choices[0].message.content.trim();
    logger.debug('Generated summary:', generatedSummary);
    
    return generatedSummary;
  } catch (error) {
    logger.error('OpenAI API error (summary):', error.message);
    throw new Error(`OpenAI API error: ${error.message}`);
  }
};

module.exports = {
  generateQuestion,
  generateSummary
};
