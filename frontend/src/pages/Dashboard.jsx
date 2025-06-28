import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import useActivityTracker from "../hooks/useActivityTracker";
import ActivityLog from "../components/ActivityLog";
import ActivityTimeChart from "../components/ActivityTimeChart";
import FocusGauge from "../components/FocusGauge";
import LiveActivityFeed from "../components/LiveActivityFeed";
import API from "../services/api";

const Dashboard = () => {
  const [userToken, setUserToken] = useState(null);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Assuming token is stored in localStorage after login
    const token = localStorage.getItem("token");
    setUserToken(token);
  }, []);

  const { clicks, scrolls, idleTime, tabSwitches, keyPresses } = useActivityTracker(userToken);

  // Fetch activity logs from backend periodically
  useEffect(() => {
    if (!userToken) return;

    const fetchActivities = async () => {
      try {
        const response = await API.get('/activity');
        setActivities(response.data.activities);
        console.log(response.data.activities);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      }
    };

    fetchActivities();

    const intervalId = setInterval(fetchActivities, 60000); // fetch every 60 seconds

    return () => clearInterval(intervalId);
  }, [userToken]);

  // Format idle time in seconds
  const idleSeconds = Math.floor(idleTime / 1000);

  // Calculate focus/productivity score (simple heuristic)
  const totalActivity = clicks + scrolls + tabSwitches + idleSeconds;
  const score = totalActivity > 0 ? Math.max(0, Math.min(100, Math.floor(100 - (idleSeconds / totalActivity) * 100))) : 100;

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
      <LiveActivityFeed />
    </DashboardLayout>
  );
};

export default Dashboard;
