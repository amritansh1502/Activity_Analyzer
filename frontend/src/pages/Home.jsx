import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";
import logo from "../assets/aiease_1749573410644.jpg";

const Home = () => {
  useEffect(() => {
    document.title = "ActivityAnalyzer - Home";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <img src={logo} alt="ActivityAnalyzer Logo" className="h-10 w-auto" />
          </Link>
          <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
          <Link to="#features" className="text-gray-700 hover:text-blue-600">Features</Link>
        </div>
        <div className="space-x-4">
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login</Link>
          <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Signup</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 py-16 bg-gray-50">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl font-bold mb-4">Stay Focused, Track Your Productivity</h1>
          <p className="text-gray-700 mb-6">
            Analyze your activities in real-time and gain insights to boost your productivity.
          </p>
          <Link to="/signup" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
            Get Started
          </Link>
        </div>
        <div className="md:w-1/2">
          <img
            src={logo}
            alt="ActivityAnalyzer Logo"
            className="w-full max-w-md mx-auto"
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-8 py-16 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <StatCard title="Real-time Tracking" value="Monitor your activities live" />
          <StatCard title="Scoring System" value="Get productivity scores" />
          <StatCard title="Insights" value="Detailed analytics and reports" />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-8 py-16 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-4">1</div>
            <p>Sign up and connect your activity data.</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-4">2</div>
            <p>Track your activities in real-time.</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-4">3</div>
            <p>Receive insights and improve focus.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-8 py-16 bg-blue-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to get focused?</h2>
        <Link to="/signup" className="bg-white text-blue-600 px-8 py-3 rounded font-semibold hover:bg-gray-100">
          Get Started
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8 mt-auto">
        <div className="max-w-5xl mx-auto px-8 flex flex-col md:flex-row justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="font-bold mb-2">Links</h3>
            <ul>
              <li><a href="/" className="hover:underline">Home</a></li>
              <li><a href="#features" className="hover:underline">Features</a></li>
              <li><a href="/login" className="hover:underline">Login</a></li>
              <li><a href="/signup" className="hover:underline">Signup</a></li>
            </ul>
          </div>
          <div className="mb-4 md:mb-0">
            <h3 className="font-bold mb-2">Contact</h3>
            <p>Email: support@activityanalyzer.com</p>
            <p>Phone: +1 234 567 890</p>
          </div>
          <div className="text-sm self-center md:self-auto">
            &copy; {new Date().getFullYear()} ActivityAnalyzer. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

