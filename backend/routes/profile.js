const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const authMiddleware = require('../middleware/auth');

// Helper function to calculate productivity score
function calculateProductivityScore(stats) {
  // Simple example: score = focusedTime / (focusedTime + distractedTime)
  const { focusedTime = 0, distractedTime = 0 } = stats;
  if (focusedTime + distractedTime === 0) return 0;
  return (focusedTime / (focusedTime + distractedTime)) * 100;
}

// GET /api/profile/insights
router.get('/insights', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Aggregate activity data for the user
    const activities = await Activity.find({ user: userId });

    // Calculate metrics
    let totalActiveTime = 0;
    let focusedTime = 0;
    let distractedTime = 0;
    let focusSessionCount = 0;
    let distractionCount = 0;
    const websiteUsage = {};

    activities.forEach((activity) => {
      totalActiveTime += activity.duration || 0;
      if (activity.eventType === 'focus') {
        focusedTime += activity.duration || 0;
        focusSessionCount += 1;
      } else if (activity.eventType === 'distraction') {
        distractedTime += activity.duration || 0;
        distractionCount += 1;
      }
      if (activity.domain) {
        websiteUsage[activity.domain] = (websiteUsage[activity.domain] || 0) + (activity.duration || 0);
      }
    });

    const productivityScore = calculateProductivityScore({ focusedTime, distractedTime });

    // Prepare top websites list
    const topWebsites = Object.entries(websiteUsage)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([domain, duration]) => ({ domain, duration }));

    res.json({
      totalActiveTime,
      focusedTime,
      distractedTime,
      focusSessionCount,
      distractionCount,
      productivityScore,
      topWebsites,
    });
  } catch (err) {
    console.error('Profile insights error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
