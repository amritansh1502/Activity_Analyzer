import React, { useEffect, useState } from 'react';
import ProfileCard from '../components/ProfileCard';
import StatCard from '../components/StatCard';
import ProductivityChart from '../components/ProductivityChart';
import WebsiteUsageTable from '../components/WebsiteUsageTable';
import DistractionAlert from '../components/DistractionAlert';
import API from '../services/api';

const Profile = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await API.get('/profile/insights');
        console.log('Profile insights response:', response.data);
        console.log('Top Websites:', response.data.topWebsites);
        // console.log(response.data.avatar)
        // console.log(response.data.avatarUrl)
        setInsights(response.data);
      } catch (err) {
        console.error('Error loading profile insights:', err);
        setError('Failed to load profile insights');
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();

    // Add interval to refresh insights every 30 seconds
    const intervalId = setInterval(fetchInsights, 30000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>{error}</div>;

  if (!insights) return <div>No profile insights available.</div>;

  console.log('Daily Activity Trend:', JSON.stringify(insights.dailyActivityTrend, null, 2));
  console.log('Focused Time:', insights.focusedTime);
  console.log('Distracted Time:', insights.distractedTime);

  return (
    <div className="p-6">
      <ProfileCard
        name={insights.name || "User Name"}
        avatarUrl={insights.avatar ? `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/${insights.avatar}` : "/default-avatar.png"}
        productivityScore={insights.productivityScore}
      />
      <div className="grid grid-cols-2 gap-4 mt-6">
        <StatCard title="Total Active Time" value={`${insights.totalActiveTime.toFixed(1)} mins`} />
        <StatCard title="Focused Time" value={`${insights.focusedTime.toFixed(1)} mins`} />
        <StatCard title="Distracted Time" value={`${insights.distractedTime.toFixed(1)} mins`} />
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
