import React, { useState, useEffect } from 'react';
import { ownerAPI } from '../../api/endpoints';
import { Loading } from '../../components/Loading';
import { Alert } from '../../components/Alert';
import { StarRating } from '../../components/StarRating';
import { StatCard } from '../../components/StatCard';
import { Store, Star, Users, MapPin, Mail, Calendar } from 'lucide-react';

export const OwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await ownerAPI.getDashboard();
        setDashboardData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load store dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <Loading text="Loading store dashboard..." />;

  const store = dashboardData?.store || {};
  const raters = dashboardData?.raters || [];
  const averageRating = dashboardData?.averageRating || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="pb-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Store Owner Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitor your store rating performance and review feedback.
        </p>
      </div>

      <Alert message={error} onClose={() => setError('')} />

      {dashboardData && (
        <>
          {/* Store Info Banner & Metric Cards */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Store Information Card */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-xs">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{store.name}</h2>
                  <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded">
                    Active Store
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100 text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>{store.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="truncate" title={store.address}>{store.address}</span>
                </div>
              </div>
            </div>

            {/* Store Rating Stat Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Overall Average Rating
                </p>
                <div className="flex items-baseline space-x-2 mt-2">
                  <span className="text-3xl font-extrabold text-gray-900">
                    {Number(averageRating) > 0 ? Number(averageRating).toFixed(2) : '0.00'}
                  </span>
                  <span className="text-sm font-medium text-gray-500">/ 5.0</span>
                </div>
                <div className="mt-2">
                  <StarRating value={averageRating} readOnly size="md" showLabel={false} />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-between">
                <span>Total Reviews</span>
                <span className="font-bold text-gray-800">{raters.length}</span>
              </div>
            </div>
          </div>

          {/* Raters Table */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Customer Ratings & Reviews</h2>
              <span className="text-xs text-gray-500 font-medium">
                {raters.length} review{raters.length !== 1 ? 's' : ''} submitted
              </span>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
              {raters.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm font-medium">No customer ratings yet</p>
                  <p className="text-gray-400 text-xs mt-1">
                    When customers rate your store, their names and scores will appear here.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                    <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-5 py-3">Customer Name</th>
                        <th className="px-5 py-3">Customer Email</th>
                        <th className="px-5 py-3">Rating Given</th>
                        <th className="px-5 py-3">Submission Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {raters.map((r, idx) => (
                        <tr key={r.id || idx} className="hover:bg-gray-50/80 transition-colors">
                          <td className="px-5 py-3.5 font-medium text-gray-900">
                            {r.userName || 'Anonymous User'}
                          </td>
                          <td className="px-5 py-3.5 text-gray-600">{r.userEmail || '-'}</td>
                          <td className="px-5 py-3.5">
                            <StarRating value={r.rating} readOnly size="sm" showLabel={true} />
                          </td>
                          <td className="px-5 py-3.5 text-gray-500 text-xs">
                            {r.submittedAt
                              ? new Date(r.submittedAt).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })
                              : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
