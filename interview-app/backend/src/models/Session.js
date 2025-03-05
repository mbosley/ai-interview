const mongoose = require('mongoose');

// Schema for individual messages in the transcript
const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['ai', 'user'],
    required: true
  },
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Schema for module configuration
const moduleConfigSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  interviewLength: {
    type: Number,
    default: 10
  }
}, { _id: false });

// Main schema for interview sessions
const sessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  transcript: [messageSchema],
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  isActive: {
    type: Boolean,
    default: true
  },
  summary: {
    type: String,
    default: null
  },
  moduleConfig: {
    type: moduleConfigSchema,
    default: () => ({
      name: 'general',
      interviewLength: 10
    })
  }
}, { timestamps: true });

// Virtual for message count
sessionSchema.virtual('messageCount').get(function() {
  return this.transcript.length;
});

// Method to add a message to the transcript
sessionSchema.methods.addMessage = function(sender, text) {
  this.transcript.push({ sender, text });
  return this.save();
};

// Method to update progress
sessionSchema.methods.updateProgress = function(progress) {
  this.progress = progress;
  return this.save();
};

// Method to mark session as complete and add summary
sessionSchema.methods.complete = function(summary) {
  this.isActive = false;
  this.progress = 100;
  this.summary = summary;
  return this.save();
};

// Method to get the last message from a specific sender
sessionSchema.methods.getLastMessageFrom = function(sender) {
  const reversedTranscript = [...this.transcript].reverse();
  return reversedTranscript.find(message => message.sender === sender);
};

// Convert object to JSON representation
sessionSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    delete ret._id;
    return ret;
  }
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
