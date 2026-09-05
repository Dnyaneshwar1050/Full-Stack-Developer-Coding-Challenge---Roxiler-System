import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminAPI } from '../../api/endpoints';
import { Loading } from '../../components/Loading';
import { Alert } from '../../components/Alert';
import { StarRating } from '../../components/StarRating';
import {
  User,
  Mail,
  MapPin,
  Shield,
  Calendar,
  ArrowLeft,
  Store,
  Star,
} from 'lucide-react';

export const UserDetails = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await adminAPI.getUserById(id);
        setUserData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <Loading text="Fetching user details..." />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/admin/users"
          className="inline-flex items-center space-x-1 text-sm font-medium text-gray-500 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Users</span>
        </Link>
      </div>

      <Alert message={error} onClose={() => setError('')} />

      {userData && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-xl font-bold text-white border border-white/30">
                {(userData.name || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-bold">{userData.name}</h1>
                <p className="text-sm text-blue-100">{userData.email}</p>
              </div>
            </div>
          </div>

          {/* Details Content */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5 capitalize">
                    {userData.role?.replace('_', ' ')}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{userData.email}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{userData.address || '-'}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Registered</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">
                    {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* If user owns a store */}
            {userData.storeRating !== undefined && userData.storeRating !== null && (
              <div className="pt-6 border-t border-gray-100">
                <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center space-x-2">
                  <Store className="w-4 h-4 text-blue-600" />
                  <span>Owned Store Performance</span>
                </h2>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Store Rating</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">
                      {userData.storeRating ? `${userData.storeRating} / 5` : 'No ratings yet'}
                    </p>
                  </div>
                  {userData.storeRating && (
                    <StarRating value={userData.storeRating} readOnly size="md" showLabel={false} />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
