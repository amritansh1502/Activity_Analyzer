import React from 'react';

const WebsiteUsageTable = ({ websites }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Top Websites</h3>
      <table className="w-full text-left text-sm">
        <thead>
          <tr>
            <th className="border-b border-gray-300 px-2 py-1">Website</th>
            <th className="border-b border-gray-300 px-2 py-1">Duration (mins)</th>
          </tr>
        </thead>
        <tbody>
          {websites.map(({ domain, duration }, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="px-2 py-1">{domain}</td>
              <td className="px-2 py-1">{(duration / 60).toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WebsiteUsageTable;
