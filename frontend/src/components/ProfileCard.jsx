import React from 'react';

const ProfileCard = ({ name, avatarUrl, productivityScore }) => {
  return (
    <div className="flex items-center bg-white p-4 rounded shadow">
      <img src={avatarUrl} alt="User Avatar" className="w-16 h-16 rounded-full mr-4" />
      <div>
        <h2 className="text-xl font-semibold">{name}</h2>
        <p className="text-gray-600">Productivity Score: {productivityScore.toFixed(1)}%</p>
      </div>
    </div>
  );
};

export default ProfileCard;
