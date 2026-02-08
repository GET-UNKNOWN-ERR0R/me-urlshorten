const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true
  },
  shortCode: {
    type: String,
    unique: true
  },
  clicks: {
    type: Number,
    default: 0
  },
  sessionId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastAccessed: {
    type: Date
  }
});

module.exports = mongoose.model("Url", urlSchema);
