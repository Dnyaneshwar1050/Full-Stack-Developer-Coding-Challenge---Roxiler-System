import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../api/endpoints';
import { Loading } from '../../components/Loading';
import { Alert } from '../../components/Alert';
import { StarRating } from '../../components/StarRating';
import {
  Store,
  PlusCircle,
  Search,
  ArrowUpDown,
  Trash2,
} from 'lucide-react';

export const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortAsc, setSortAsc] = useState(true);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getStores();
      setStores(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete store "${name}"?`)) {
      return;
    }
    try {
      await adminAPI.deleteStore(id);
      setStores((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete store');
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filteredStores = stores
    .filter((s) => {
      const term = searchTerm.toLowerCase();
      return (
        (s.name && s.name.toLowerCase().includes(term)) ||
        (s.email && s.email.toLowerCase().includes(term)) ||
        (s.address && s.address.toLowerCase().includes(term))
      );
    })
    .sort((a, b) => {
      if (sortField === 'averageRating') {
        const rateA = parseFloat(a.averageRating) || 0;
        const rateB = parseFloat(b.averageRating) || 0;
        return sortAsc ? rateA - rateB : rateB - rateA;
      }
      let valA = (a[sortField] || '').toString().toLowerCase();
      let valB = (b[sortField] || '').toString().toLowerCase();
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stores Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse and manage all registered stores and their ratings.
          </p>
        </div>
        <Link
          to="/admin/stores/new"
          className="inline-flex items-center space-x-2 px-3.5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Store</span>
        </Link>
      </div>

      <Alert message={error} onClose={() => setError('')} />

      {/* Search Bar */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search stores by name, email, address..."
            className="w-full pl-9 pr-3.5 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        {loading ? (
          <Loading text="Loading stores..." />
        ) : filteredStores.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Store className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm font-medium">No stores found</p>
            <p className="text-gray-400 text-xs mt-1">Try another search term or create a store</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th
                    className="px-5 py-3 cursor-pointer hover:text-gray-800"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Store Name</span>
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </div>
                  </th>
                  <th
                    className="px-5 py-3 cursor-pointer hover:text-gray-800"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Email</span>
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </div>
                  </th>
                  <th className="px-5 py-3">Address</th>
                  <th
                    className="px-5 py-3 cursor-pointer hover:text-gray-800"
                    onClick={() => handleSort('averageRating')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Average Rating</span>
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </div>
                  </th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredStores.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-gray-900">{s.name}</td>
                    <td className="px-5 py-3.5 text-gray-600">{s.email}</td>
                    <td className="px-5 py-3.5 text-gray-500 max-w-xs truncate" title={s.address}>
                      {s.address}
                    </td>
                    <td className="px-5 py-3.5">
                      <StarRating value={s.averageRating} readOnly size="sm" />
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(s.id, s.name)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
                        title="Delete Store"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
