import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_BASE_URL.replace('/api', ''), { transports: ['websocket'] });

const LiveActivityFeed = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    socket.on('activity_log', (activity) => {
      setLogs((prevLogs) => [activity, ...prevLogs].slice(0, 20)); // keep last 20 logs
    });

    return () => {
      socket.off('activity_log');
    };
  }, []);

  return (
    <div className="bg-white p-4 shadow rounded mt-6 max-h-64 overflow-auto">
      <h3 className="text-lg font-semibold mb-2">Live Activity Feed</h3>
      <ul className="text-sm">
        {logs.map((log, index) => (
          <li key={index} className="border-b border-gray-200 py-1">
            <span className="font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span> -{' '}
            <span>{log.eventType.replace('_', ' ')}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LiveActivityFeed;
