require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Load interview modules configuration
let interviewModules = {};
const modulesPath = path.join(__dirname, '../modules');

// Check if modules directory exists
if (fs.existsSync(modulesPath)) {
  // Read all module configuration files
  fs.readdirSync(modulesPath)
    .filter(file => file.endsWith('.json'))
    .forEach(file => {
      try {
        const moduleName = path.basename(file, '.json');
        const moduleConfig = require(path.join(modulesPath, file));
        interviewModules[moduleName] = moduleConfig;
      } catch (error) {
        console.error(`Error loading module ${file}:`, error);
      }
    });
}

// Default configuration
const config = {
  // Server configuration
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // LLM configuration
  llmProvider: process.env.LLM_PROVIDER || 'openai',
  openaiApiKey: process.env.OPENAI_API_KEY,
  llmModel: process.env.LLM_MODEL || 'gpt-4o',
  llmTemperature: parseFloat(process.env.LLM_TEMPERATURE || '0.7'),
  
  // Database configuration
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/ai-interview',
  
  // CORS configuration
  corsOrigin: process.env.CORS_ORIGIN || '*',
  
  // Authentication
  adminToken: process.env.ADMIN_TOKEN || 'secret_admin_token_here',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_here',
  
  // Interview settings
  defaultInterviewLength: parseInt(process.env.DEFAULT_INTERVIEW_LENGTH || '10'), // Number of planned questions
  maxInterviewDuration: parseInt(process.env.MAX_INTERVIEW_DURATION || '1800'), // 30 minutes in seconds
  
  // Default system prompts for conversation
  systemPrompts: {
    initial: process.env.PROMPT_INITIAL || "You are an AI interviewer. Ask open-ended questions that encourage detailed responses. Be conversational and thoughtful. Start with a friendly introduction and an interesting first question.",
    followUp: process.env.PROMPT_FOLLOWUP || "Based on the conversation so far, ask a follow-up question that explores the participant's previous answer more deeply. Be conversational and thoughtful.",
    summary: process.env.PROMPT_SUMMARY || "Summarize the key points from this interview conversation, highlighting the most interesting insights and themes. Be concise but comprehensive."
  },
  
  // Interview modules configuration
  interviewModules: interviewModules,
  
  // Default interview module to use if none specified
  defaultModule: process.env.DEFAULT_MODULE || 'political'
};

module.exports = config;
