const config = require('../config/config');
const openaiProvider = require('./openaiProvider');
const logger = require('../utils/logger');

/**
 * Generate a question based on conversation context using the configured LLM provider
 * @param {Object} context Context object containing session information and conversation history
 * @returns {Promise<string>} The generated question
 */
const generateQuestion = async (context) => {
  try {
    // Select provider based on configuration
    if (config.llmProvider === 'openai') {
      return await openaiProvider.generateQuestion(context);
    }
    
    // Fallback response if provider not configured
    logger.warn(`LLM provider '${config.llmProvider}' not implemented. Using fallback question.`);
    return "Could you tell me more about that?";
  } catch (error) {
    logger.error('Error generating question:', error);
    return "I'd be interested to hear more about your perspective on this topic.";
  }
};

/**
 * Generate a summary of the interview session
 * @param {Array} transcript The full conversation transcript
 * @param {string} prompt System prompt for summary generation
 * @param {number} temperature Temperature for summary generation
 * @param {string} model Model to use for summary generation
 * @returns {Promise<string>} The generated summary
 */
const generateSummary = async (transcript, prompt = config.systemPrompts.summary, temperature = 0.5, model = config.llmModel) => {
  try {
    // Use the same provider as for questions
    if (config.llmProvider === 'openai') {
      return await openaiProvider.generateSummary(transcript, prompt, temperature, model);
    }
    
    // Fallback summary if provider not configured
    logger.warn(`LLM provider '${config.llmProvider}' not implemented for summary. Using fallback.`);
    return "This concludes the interview session. Thank you for your participation.";
  } catch (error) {
    logger.error('Error generating summary:', error);
    return "Thank you for participating in this interview. Your responses have been recorded.";
  }
};

module.exports = {
  generateQuestion,
  generateSummary
};
