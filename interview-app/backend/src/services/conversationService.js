const config = require('../config/config');
const llmService = require('./llmService');
const logger = require('../utils/logger');
const { calculateProgress } = require('../utils/security');
const Session = require('../models/Session');

/**
 * Get the interview module configuration
 * @param {string} moduleName The module name to load
 * @returns {Object} The module configuration
 */
const getModuleConfig = (moduleName) => {
  // Use the default module if the requested one doesn't exist
  const availableModules = config.interviewModules;
  const defaultModule = config.defaultModule;
  
  if (!moduleName || !availableModules[moduleName]) {
    logger.info(`Module "${moduleName}" not found, using default module "${defaultModule}"`);
    moduleName = defaultModule;
  }
  
  // If no modules are available, use the default system prompts
  if (!availableModules[moduleName]) {
    logger.warn(`No interview modules found, using default system prompts`);
    return {
      systemPrompts: config.systemPrompts,
      settings: {
        interviewLength: config.defaultInterviewLength,
        temperature: config.llmTemperature,
        model: config.llmModel
      }
    };
  }
  
  return availableModules[moduleName];
};

/**
 * Start a new interview session
 * @param {string} sessionId The session ID
 * @param {string} moduleName The interview module to use
 * @returns {Promise<Object>} The session and initial question
 */
const startSession = async (sessionId, moduleName) => {
  try {
    // Get the interview module configuration
    const moduleConfig = getModuleConfig(moduleName);
    
    // Generate initial question using the module's initial prompt
    const initialQuestion = await llmService.generateQuestion({
      prompt: moduleConfig.systemPrompts.initial,
      temperature: moduleConfig.settings.temperature,
      model: moduleConfig.settings.model
    });
    
    // Create a new session in the database
    const session = new Session({
      sessionId,
      transcript: [{ sender: 'ai', text: initialQuestion }],
      progress: 0,
      isActive: true,
      moduleConfig: {
        name: moduleName,
        interviewLength: moduleConfig.settings.interviewLength
      }
    });
    
    // Save the session
    await session.save();
    
    return {
      session,
      initialQuestion,
      moduleName
    };
  } catch (error) {
    logger.error('Error starting session:', error);
    throw new Error('Failed to start interview session');
  }
};

/**
 * Process a user answer and generate the next question
 * @param {string} sessionId The session ID
 * @param {string} answer The user's answer
 * @returns {Promise<Object>} Object containing next question and updated progress
 */
const processAnswer = async (sessionId, answer) => {
  try {
    // Get the session from the database
    const session = await Session.findOne({ sessionId });
    if (!session) {
      throw new Error('Session not found');
    }
    
    // Check if the session is already complete
    if (!session.isActive) {
      return {
        isComplete: true,
        progress: 100,
        nextQuestion: null
      };
    }
    
    // Get the module configuration for this session
    const moduleName = session.moduleConfig?.name || config.defaultModule;
    const moduleConfig = getModuleConfig(moduleName);
    
    // Check if the answer is a special command
    if (answer === '[END_INTERVIEW]') {
      // End the interview immediately
      const summary = await llmService.generateSummary(
        session.transcript, 
        moduleConfig.systemPrompts.summary,
        moduleConfig.settings.temperature,
        moduleConfig.settings.model
      );
      await session.complete(summary);
      
      return {
        isComplete: true,
        progress: 100,
        summary
      };
    }
    
    // Add the user's answer to the transcript
    await session.addMessage('user', answer);
    
    // Calculate new progress
    // Progress is based on number of turns relative to the module's interview length
    const interviewLength = session.moduleConfig?.interviewLength || moduleConfig.settings.interviewLength;
    const totalExpectedTurns = interviewLength * 2; // Questions + answers
    const currentTurns = session.transcript.length;
    const progress = calculateProgress(currentTurns, totalExpectedTurns);
    
    // Update progress in the session
    await session.updateProgress(progress);
    
    // Check if we should end the interview
    if (progress >= 100) {
      // Generate summary and mark as complete
      const summary = await llmService.generateSummary(
        session.transcript, 
        moduleConfig.systemPrompts.summary,
        moduleConfig.settings.temperature,
        moduleConfig.settings.model
      );
      await session.complete(summary);
      
      return {
        isComplete: true,
        progress: 100,
        summary
      };
    }
    
    // Generate next question based on the updated transcript and module's follow-up prompt
    const nextQuestion = await llmService.generateQuestion({
      transcript: session.transcript,
      prompt: moduleConfig.systemPrompts.followUp,
      temperature: moduleConfig.settings.temperature,
      model: moduleConfig.settings.model
    });
    
    // Add the AI's question to the transcript
    await session.addMessage('ai', nextQuestion);
    
    return {
      nextQuestion,
      progress,
      isComplete: false
    };
  } catch (error) {
    logger.error('Error processing answer:', error);
    throw new Error('Failed to process answer');
  }
};

/**
 * Get the current progress of a session
 * @param {string} sessionId The session ID
 * @returns {Promise<Object>} Object containing progress and completion status
 */
const getSessionProgress = async (sessionId) => {
  try {
    const session = await Session.findOne({ sessionId });
    if (!session) {
      throw new Error('Session not found');
    }
    
    return {
      progress: session.progress,
      isComplete: !session.isActive,
      messageCount: session.transcript.length
    };
  } catch (error) {
    logger.error('Error getting session progress:', error);
    throw new Error('Failed to get session progress');
  }
};

/**
 * Get the summary of a completed session
 * @param {string} sessionId The session ID
 * @returns {Promise<Object>} Object containing the session summary
 */
const getSessionSummary = async (sessionId) => {
  try {
    const session = await Session.findOne({ sessionId });
    if (!session) {
      throw new Error('Session not found');
    }
    
    // If the session is still active, generate a summary
    if (session.isActive) {
      const summary = await llmService.generateSummary(session.transcript);
      return { summary };
    }
    
    // Return the stored summary
    return { summary: session.summary };
  } catch (error) {
    logger.error('Error getting session summary:', error);
    throw new Error('Failed to get session summary');
  }
};

module.exports = {
  startSession,
  processAnswer,
  getSessionProgress,
  getSessionSummary
};
