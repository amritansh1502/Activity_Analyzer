

const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const authMiddleware = require('../middleware/auth');
let io;

const setSocketIO = (socketio) => {
  io = socketio;
};

const getSocketIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

// Log an activity event
router.post('/log', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const events = Array.isArray(req.body) ? req.body : [req.body];

    console.log('Received activity events:', events);

    const activities = events.map(event => {
      console.log('Event duration:', event.duration);
      return {
        userId,
        eventType: event.eventType,
        timestamp: event.timestamp ? new Date(event.timestamp) : new Date(),
        duration: event.duration || 0,
      };
    });

    await Activity.insertMany(activities);

    // Emit real-time event to connected clients
    const socketio = getSocketIO();
    activities.forEach(activity => {
      socketio.emit('activity_log', {
        userId: activity.userId,
        eventType: activity.eventType,
        timestamp: activity.timestamp,
        duration: activity.duration,
      });
    });

    res.status(201).json({ message: 'Activities logged', count: activities.length });
  } catch (err) {
    console.error('Error logging activities:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = { router, setSocketIO };

// Get activity logs for authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Fetching activities for user:', userId);
    const activities = await Activity.find({ userId: userId }).sort({ timestamp: -1 });
    console.log('Found activities:', activities.length);
    res.json({ activities });
  } catch (err) {
    console.error('Error fetching activities:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = { router, setSocketIO };
