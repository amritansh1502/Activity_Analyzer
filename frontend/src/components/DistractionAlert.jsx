import React from 'react';

const DistractionAlert = ({ count }) => {
  if (count === 0) return null;

  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Distraction Alert!</strong>
      <span className="block sm:inline"> You had {count} distractions during your sessions.</span>
    </div>
  );
};

export default DistractionAlert;
