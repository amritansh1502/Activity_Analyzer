import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ProfileCard from '../components/ProfileCard';
import StatCard from '../components/StatCard';
import ProductivityChart from '../components/ProductivityChart';
import WebsiteUsageTable from '../components/WebsiteUsageTable';
import DistractionAlert from '../components/DistractionAlert';
import { fetchProfile } from '../store/slices/profileSlice';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ProfileCard from '../components/ProfileCard';
import StatCard from '../components/StatCard';
import ProductivityChart from '../components/ProductivityChart';
import WebsiteUsageTable from '../components/WebsiteUsageTable';
import DistractionAlert from '../components/DistractionAlert';
import { fetchProfile } from '../store/slices/profileSlice';

const Profile = () => {
  useEffect(() => {
    document.title = "ActivityAnalyzer - Profile";
  }, []);

  const dispatch = useDispatch();
  const { profile: insights, loading, error } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchProfile());

    const intervalId = setInterval(() => {
      dispatch(fetchProfile());
    }, 30000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

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
