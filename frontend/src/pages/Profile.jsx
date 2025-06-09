import React, { useEffect, useState } from 'react';
import ProfileCard from '../components/ProfileCard';
import StatCard from '../components/StatCard';
import ProductivityChart from '../components/ProductivityChart';
import WebsiteUsageTable from '../components/WebsiteUsageTable';
import DistractionAlert from '../components/DistractionAlert';
import api from '../services/api';

const Profile = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await api.get('/profile/insights');
        setInsights(response.data);
      } catch (err) {
        setError('Failed to load profile insights');
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <ProfileCard
        name="User Name"
        avatarUrl="/path/to/avatar.jpg"
        productivityScore={insights.productivityScore}
      />
      <div className="grid grid-cols-2 gap-4 mt-6">
        <StatCard title="Total Active Time" value={`${(insights.totalActiveTime / 60).toFixed(1)} mins`} />
        <StatCard title="Focused Time" value={`${(insights.focusedTime / 60).toFixed(1)} mins`} />
        <StatCard title="Distracted Time" value={`${(insights.distractedTime / 60).toFixed(1)} mins`} />
        <StatCard title="Focus Sessions" value={insights.focusSessionCount} />
      </div>
      <div className="mt-6">
        <ProductivityChart data={insights.dailyActivityTrend || []} />
      </div>
      <div className="mt-6">
        <WebsiteUsageTable websites={insights.topWebsites} />
      </div>
      <div className="mt-6">
        <DistractionAlert count={insights.distractionCount} />
      </div>
    </div>
  );
};

export default Profile;
