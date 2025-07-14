

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import DashboardLayout from "../layouts/DashboardLayout";
import useActivityTracker from "../hooks/useActivityTracker";
import ActivityLog from "../components/ActivityLog";
import ActivityTimeChart from "../components/ActivityTimeChart";
import FocusGauge from "../components/FocusGauge";
import LiveActivityFeed from "../components/LiveActivityFeed";
import WebsiteUsageTable from "../components/WebsiteUsageTable";
import { fetchActivities } from "../store/slices/activitySlice";

const Dashboard = () => {
  useEffect(() => {
    document.title = "ActivityAnalyzer - Dashboard";
  }, []);

  const dispatch = useDispatch();
  const { activities, loading, error } = useSelector((state) => state.activity);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    // Assuming token is stored in localStorage after login
    const token = localStorage.getItem("token");
    setUserToken(token);
  }, []);

  const { clicks, scrolls, idleTime, tabSwitches, keyPresses } = useActivityTracker(userToken);

  useEffect(() => {
    if (!userToken) return;

    dispatch(fetchActivities());

    const intervalId = setInterval(() => {
      dispatch(fetchActivities());
    }, 60000);

    return () => clearInterval(intervalId);
  }, [dispatch, userToken]);

  // Aggregate website visits by domain and sum durations
  const aggregateWebsites = () => {
    const websiteMap = new Map();

    activities.forEach((activity) => {
      if (activity.eventType === "website_visit" && activity.websiteUrl) {
        const domain = activity.websiteUrl;
        const prevDuration = websiteMap.get(domain) || 0;
        websiteMap.set(domain, prevDuration + (activity.duration || 0));
      }
    });

    // Convert map to array and sort by duration descending
    const sortedWebsites = Array.from(websiteMap.entries())
      .map(([domain, duration]) => ({ domain, duration }))
      .sort((a, b) => b.duration - a.duration);

    return sortedWebsites.slice(0, 10); // top 10 websites
  };

  const topWebsites = aggregateWebsites();

  // Format idle time in seconds
  const idleSeconds = Math.floor(idleTime / 1000);

  // Calculate focus/productivity score (simple heuristic)
  const totalActivity = clicks + scrolls + tabSwitches + idleSeconds;
  const score =
    totalActivity > 0
      ? Math.max(0, Math.min(100, Math.floor(100 - (idleSeconds / totalActivity) * 100)))
      : 100;

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-semibold mb-4">Activity Summary</h2>

      <div className="grid grid-cols-5 gap-6">
        <div className="bg-white p-4 shadow rounded">Clicks: {clicks}</div>
        <div className="bg-white p-4 shadow rounded">Scrolls: {scrolls}</div>
        <div className="bg-white p-4 shadow rounded">Idle Time: {idleSeconds}s</div>
        <div className="bg-white p-4 shadow rounded">Tab Switches: {tabSwitches}</div>
        <div className="bg-white p-4 shadow rounded">Key Presses: {keyPresses}</div>
      </div>

      <FocusGauge score={score} />
      <ActivityTimeChart activities={activities} />
      <ActivityLog activities={activities} />
      <WebsiteUsageTable websites={topWebsites} />
      <LiveActivityFeed />
    </DashboardLayout>
  );
};

export default Dashboard;
