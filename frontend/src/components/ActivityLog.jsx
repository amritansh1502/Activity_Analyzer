import React from 'react';

const ActivityLog = ({ activities = [] }) => {
  return (
    <div className="bg-white p-4 shadow rounded mt-6">
      <h3 className="text-lg font-semibold mb-4">Activity Log</h3>
      <table className="w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">Timestamp</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Event Type</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Duration (ms)</th>
          </tr>
        </thead>
        <tbody>
          {activities.length === 0 ? (
            <tr>
              <td colSpan="3" className="border border-gray-300 px-4 py-2 text-center">
                No activity logged yet.
              </td>
            </tr>
          ) : (
            activities.map((activity) => (
              <tr key={activity._id}>
                <td className="border border-gray-300 px-4 py-2">{new Date(activity.timestamp).toLocaleString()}</td>
                <td className="border border-gray-300 px-4 py-2">{activity.eventType}</td>
                <td className="border border-gray-300 px-4 py-2">{activity.duration}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityLog;
