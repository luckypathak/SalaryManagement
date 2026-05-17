import React, { useState, useEffect, useContext } from 'react';
import api from './api';
import { AuthContext } from './AuthContext';
import { TrendingUp, Users, DollarSign, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [country, setCountry] = useState('USA');
  const [jobTitle, setJobTitle] = useState('');
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const url = `insights/?country=${country}${jobTitle ? `&job_title=${jobTitle}` : ''}`;
      const response = await api.get(url);
      setInsights(response.data);
    } catch (error) {
      console.error("Failed to fetch insights", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 text-blue-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">Salary Insights</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/employees')}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Manage Employees
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center text-red-600 hover:text-red-800"
              >
                <LogOut className="h-4 w-4 mr-1" /> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Filter Insights</h2>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input 
                type="text" 
                value={country} 
                onChange={(e) => setCountry(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="e.g. USA"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title (Optional)</label>
              <input 
                type="text" 
                value={jobTitle} 
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="e.g. Software Engineer"
              />
            </div>
            <div className="flex items-end">
              <button 
                onClick={fetchInsights}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Analyze
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading insights...</div>
        ) : insights ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full text-green-600">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Minimum Salary ({insights.country})</p>
                <h3 className="text-2xl font-bold text-gray-900">${insights.min_salary?.toLocaleString() || 0}</h3>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Average Salary ({insights.country})</p>
                <h3 className="text-2xl font-bold text-gray-900">${Math.round(insights.avg_salary || 0).toLocaleString()}</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Maximum Salary ({insights.country})</p>
                <h3 className="text-2xl font-bold text-gray-900">${insights.max_salary?.toLocaleString() || 0}</h3>
              </div>
            </div>

            {insights.job_title_avg_salary && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-200 col-span-1 md:col-span-3 mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Job Specific Insight</h3>
                    <p className="text-gray-500">Average salary for <strong>{insights.job_title}</strong> in <strong>{insights.country}</strong></p>
                  </div>
                  <div className="text-3xl font-extrabold text-indigo-600">
                    ${Math.round(insights.job_title_avg_salary).toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">No data found.</div>
        )}
      </main>
    </div>
  );
}
