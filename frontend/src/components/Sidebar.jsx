import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-full bg-gray-900 text-white p-4">
      <h2 className="text-2xl font-bold mb-6">Activity Analyzer</h2>
      <nav className="flex flex-col space-y-4">
        <Link to="/dashboard" className="hover:text-blue-400">Dashboard</Link>
        <Link to="/profile" className="hover:text-blue-400">Profile</Link>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="mt-10 text-red-400 hover:text-red-600"
        >
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
