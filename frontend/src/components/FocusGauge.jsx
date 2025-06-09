import React from 'react';
import { RadialBarChart, RadialBar, Legend } from 'recharts';

const FocusGauge = ({ score }) => {
  const data = [
    {
      name: 'Focus',
      value: score,
      fill: '#8884d8',
    },
  ];

  return (
    <div className="bg-white p-4 shadow rounded mt-6 w-full max-w-sm mx-auto">
      <h3 className="text-lg font-semibold mb-4 text-center">Focus/Productivity Score</h3>
      <RadialBarChart
        width={300}
        height={300}
        cx="50%"
        cy="50%"
        innerRadius="70%"
        outerRadius="100%"
        barSize={20}
        data={data}
        startAngle={180}
        endAngle={-180}
      >
        <RadialBar
          minAngle={15}
          background
          clockWise
          dataKey="value"
          cornerRadius={10}
        />
        <Legend
          iconSize={10}
          layout="vertical"
          verticalAlign="middle"
          wrapperStyle={{ right: 0, top: 20, lineHeight: '24px' }}
        />
      </RadialBarChart>
      <div className="text-center text-4xl font-bold mt-4">{score}%</div>
    </div>
  );
};

export default FocusGauge;
