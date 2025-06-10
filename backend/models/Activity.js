const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventType: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  duration: { type: Number, default: 0 }, // duration in milliseconds, optional
  websiteUrl: { type: String, default: null } // optional website URL for website usage events
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
