import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../api/endpoints';
import { StatCard } from '../../components/StatCard';
import { Loading } from '../../components/Loading';
import { Alert } from '../../components/Alert';
import { Users, Store, Star, UserPlus, PlusCircle, ArrowRight } from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const res = await adminAPI.getDashboard();
        setStats(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load platform statistics');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <Loading text="Loading dashboard statistics..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            System overview and quick management actions.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to="/admin/users/new"
            className="inline-flex items-center space-x-2 px-3.5 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-xs"
          >
            <UserPlus className="w-4 h-4 text-gray-500" />
            <span>Add User</span>
          </Link>
          <Link
            to="/admin/stores/new"
            className="inline-flex items-center space-x-2 px-3.5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Store</span>
          </Link>
        </div>
      </div>

      <Alert message={error} onClose={() => setError('')} />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Total Stores"
          value={stats.totalStores}
          icon={Store}
          color="blue"
        />
        <StatCard
          title="Total Ratings Submitted"
          value={stats.totalRatings}
          icon={Star}
          color="amber"
        />
      </div>

      {/* Quick Navigation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">User Management</h2>
            <p className="text-sm text-gray-500 mt-1">
              View, search, filter, and inspect registered users across Admin, Normal User, and Store Owner roles.
            </p>
          </div>
          <div className="mt-6 flex items-center space-x-3">
            <Link
              to="/admin/users"
              className="inline-flex items-center space-x-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              <span>Manage Users</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Store className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Store Management</h2>
            <p className="text-sm text-gray-500 mt-1">
              View all stores with their current overall average ratings, search stores, or register new stores with owner accounts.
            </p>
          </div>
          <div className="mt-6 flex items-center space-x-3">
            <Link
              to="/admin/stores"
              className="inline-flex items-center space-x-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              <span>Manage Stores</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
