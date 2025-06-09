import { useEffect } from 'react';
import { pingServer } from './services/api';

function App() {
  useEffect(() => {
    pingServer().then(res => console.log(res.data));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-blue-600">Activity Analyzer</h1>
    </div>
  );
}
