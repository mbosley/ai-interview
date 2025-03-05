const conversationService = require('../services/conversationService');
const logger = require('../utils/logger');
const { generateSessionId, sanitizeInput } = require('../utils/security');

/**
 * Start a new interview session
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const startInterview = async (req, res, next) => {
  try {
    // Generate a new session ID
    const sessionId = generateSessionId();
    
    // Get the requested module name from the request body
    const { moduleName } = req.body;
    
    // Start the session and get the initial question
    const { initialQuestion, moduleName: selectedModule } = await conversationService.startSession(sessionId, moduleName);
    
    // Return the session ID, initial question, and selected module
    res.status(201).json({
      sessionId,
      initialQuestion,
      moduleName: selectedModule
    });
  } catch (error) {
    logger.error('Error starting interview:', error);
    next(error);
  }
};

/**
 * Submit an answer and get the next question
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const submitAnswer = async (req, res, next) => {
  try {
    const { sessionId, answer } = req.body;
    
    // Validate required fields
    if (!sessionId) {
      return res.status(400).json({ error: 'Missing sessionId' });
    }
    if (answer === undefined) {
      return res.status(400).json({ error: 'Missing answer' });
    }
    
    // Process the answer and get the next question
    const sanitizedAnswer = sanitizeInput(answer);
    const result = await conversationService.processAnswer(sessionId, sanitizedAnswer);
    
    // Get Socket.io instance
    const io = req.app.get('io');
    
    // Emit events to the session room and admin room
    if (io) {
      if (result.isComplete) {
        // Session complete event
        io.to(sessionId).to('admin').emit('sessionUpdate', {
          sessionId,
          isComplete: true,
          progress: 100,
          summary: result.summary
        });
      } else if (result.nextQuestion) {
        // New question event
        io.to(sessionId).to('admin').emit('newQuestion', {
          sessionId,
          question: result.nextQuestion,
          progress: result.progress
        });
      }
    }
    
    // Return the result
    res.status(200).json(result);
  } catch (error) {
    logger.error('Error submitting answer:', error);
    next(error);
  }
};

/**
 * Get the current progress of a session
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getProgress = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    
    // Validate session ID
    if (!sessionId) {
      return res.status(400).json({ error: 'Missing sessionId' });
    }
    
    // Get the session progress
    const progress = await conversationService.getSessionProgress(sessionId);
    
    // Return the progress
    res.status(200).json(progress);
  } catch (error) {
    logger.error('Error getting progress:', error);
    next(error);
  }
};

/**
 * Get the summary of a completed session
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getSummary = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    
    // Validate session ID
    if (!sessionId) {
      return res.status(400).json({ error: 'Missing sessionId' });
    }
    
    // Get the session summary
    const { summary } = await conversationService.getSessionSummary(sessionId);
    
    // Return the summary
    res.status(200).json({ summary });
  } catch (error) {
    logger.error('Error getting summary:', error);
    next(error);
  }
};

module.exports = {
  startInterview,
  submitAnswer,
  getProgress,
  getSummary
};
