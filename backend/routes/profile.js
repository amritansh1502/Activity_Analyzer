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
    const activities = await Activity.find({ userId: userId });

    // Calculate metrics
    let totalActiveTime = 0;
    let focusedTime = 0;
    let distractedTime = 0;
    let focusSessionCount = 0;
    let distractionCount = 0;

    // For daily trend aggregation
    const dailyDataMap = new Map();

    activities.forEach((activity) => {
      const durationMinutes = (activity.duration || 0) / 60000; // convert ms to minutes
      totalActiveTime += durationMinutes;
      if (activity.eventType === 'focus') {
        focusedTime += durationMinutes;
        focusSessionCount += 1;
      } else if (activity.eventType === 'distraction') {
        distractedTime += durationMinutes;
        distractionCount += 1;
      }

      // Aggregate daily data
      const dateObj = new Date(activity.timestamp);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;
      if (!dailyDataMap.has(dateKey)) {
        dailyDataMap.set(dateKey, { focusedTime: 0, distractedTime: 0 });
      }
      const dayData = dailyDataMap.get(dateKey);
      if (activity.eventType === 'focus') {
        dayData.focusedTime += durationMinutes;
      } else if (activity.eventType === 'distraction') {
        dayData.distractedTime += durationMinutes;
      }
    });

    // Prepare dailyActivityTrend array
    const dailyActivityTrend = Array.from(dailyDataMap.entries()).map(([date, data]) => {
      const productivityScore = calculateProductivityScore(data);
      return {
        date,
        focusedTime: data.focusedTime,
        distractedTime: data.distractedTime,
        productivityScore,
      };
    });

    const productivityScore = calculateProductivityScore({ focusedTime, distractedTime });

    // Aggregate top websites usage
    const websiteUsageMap = new Map();

    activities.forEach((activity) => {
      if (activity.websiteUrl) {
        if (!websiteUsageMap.has(activity.websiteUrl)) {
          websiteUsageMap.set(activity.websiteUrl, 0);
        }
        websiteUsageMap.set(activity.websiteUrl, websiteUsageMap.get(activity.websiteUrl) + (activity.duration || 0));
      }
    });

    // Convert to array and sort by duration descending
    const topWebsites = Array.from(websiteUsageMap.entries())
      .map(([websiteUrl, durationMs]) => ({
        domain: websiteUrl,
        duration: durationMs / 60_000,
      }))
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10); // top 10 websites

    res.json({
      totalActiveTime,
      focusedTime,
      distractedTime,
      focusSessionCount,
      distractionCount,
      productivityScore,
      topWebsites,
      dailyActivityTrend,
    });
  } catch (err) {
    console.error('Profile insights error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
