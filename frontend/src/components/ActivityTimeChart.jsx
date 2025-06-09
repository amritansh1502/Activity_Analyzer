import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

const ActivityTimeChart = ({ activities = [] }) => {
  // Aggregate activities by date and eventType
  const dataMap = {};

  activities.forEach(({ eventType, timestamp }) => {
    const date = new Date(timestamp).toLocaleDateString();
    if (!dataMap[date]) {
      dataMap[date] = { date, click: 0, scroll: 0, idle: 0, tab_switch: 0 };
    }
    const key = eventType.toLowerCase().replace(' ', '_');
    if (dataMap[date][key] !== undefined) {
      dataMap[date][key] += 1;
    }
  });

  const data = Object.values(dataMap);

  return (
    <div className="bg-white p-4 shadow rounded mt-6">
      <h3 className="text-lg font-semibold mb-4">Activity Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="click" stroke="#8884d8" name="Clicks" />
          <Line type="monotone" dataKey="scroll" stroke="#82ca9d" name="Scrolls" />
          <Line type="monotone" dataKey="idle" stroke="#ffc658" name="Idle" />
          <Line type="monotone" dataKey="tab_switch" stroke="#ff7300" name="Tab Switches" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityTimeChart;
