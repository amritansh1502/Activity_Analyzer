/**
 * This file contains sample test data and scripts to simulate user activity events
 * for testing analytics on the Profile page.
 */

const mongoose = require('mongoose');
const Activity = require('../models/Activity');

// Sample userId for testing - replace with actual user id from your database
const testUserId = new mongoose.Types.ObjectId('64a1f0c2f1a2b3c4d5e6f789');

// Sample activity events to insert for testing
const sampleActivities = [
  {
    userId: testUserId,
    eventType: 'focus',
    timestamp: new Date(Date.now() - 3600 * 1000), // 1 hour ago
    duration: 25 * 60 * 1000, // 25 minutes
  },
  {
    userId: testUserId,
    eventType: 'distraction',
    timestamp: new Date(Date.now() - 1800 * 1000), // 30 minutes ago
    duration: 5 * 60 * 1000, // 5 minutes
  },
  {
    userId: testUserId,
    eventType: 'focus',
    timestamp: new Date(Date.now() - 900 * 1000), // 15 minutes ago
    duration: 15 * 60 * 1000, // 15 minutes
  },
  {
    userId: testUserId,
    eventType: 'distraction',
    timestamp: new Date(Date.now() - 300 * 1000), // 5 minutes ago
    duration: 2 * 60 * 1000, // 2 minutes
  },
];

// Function to insert sample activities into the database
async function insertSampleActivities() {
  try {
    await Activity.insertMany(sampleActivities);
    console.log('Sample activities inserted successfully');
  } catch (error) {
    console.error('Error inserting sample activities:', error);
  }
}

// Export for use in test scripts
module.exports = {
  insertSampleActivities,
  testUserId,
};
