import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SimpleAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    // Simple mock authentication
    localStorage.setItem('mockToken', 'mock-token');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('mockToken');
    setIsAuthenticated(false);
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome!</h1>
          <p className="text-gray-600 mb-4">You are authenticated</p>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="ml-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Simple Auth Test</h1>
        <p className="text-gray-600 mb-4">Click to simulate login</p>
        <button 
          onClick={handleLogin}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Login
        </button>
        <button 
          onClick={() => navigate('/')}
          className="ml-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Back
        </button>
      </div>
    </div>
  );
}
