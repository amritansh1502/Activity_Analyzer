import DashboardLayout from "../layouts/DashboardLayout";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <h2 className="text-2xl font-semibold mb-4">Activity Summary</h2>

      {/* Placeholder for Day 3: Cards, Charts, Tables */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-4 shadow rounded">Clicks: 0</div>
        <div className="bg-white p-4 shadow rounded">Scrolls: 0</div>
        <div className="bg-white p-4 shadow rounded">Idle Time: 0s</div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
