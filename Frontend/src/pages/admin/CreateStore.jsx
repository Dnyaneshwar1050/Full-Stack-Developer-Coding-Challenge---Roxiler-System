import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminAPI } from '../../api/endpoints';
import {
  validateName,
  validateEmail,
  validatePassword,
  validateAddress,
} from '../../utils/validation';
import { Alert } from '../../components/Alert';
import { Store, ArrowLeft, Mail, Lock, MapPin, Building } from 'lucide-react';

export const CreateStore = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const newErrors = {};
    const nameErr = validateName(formData.name);
    if (nameErr) newErrors.name = nameErr;

    const emailErr = validateEmail(formData.email);
    if (emailErr) newErrors.email = emailErr;

    const addrErr = validateAddress(formData.address);
    if (addrErr) newErrors.address = addrErr;

    const passErr = validatePassword(formData.password);
    if (passErr) newErrors.password = passErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      await adminAPI.createStore({
        name: formData.name.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        password: formData.password,
      });
      navigate('/admin/stores');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to create store. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/admin/stores"
          className="inline-flex items-center space-x-1 text-sm font-medium text-gray-500 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Stores List</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Add New Store</h1>
            <p className="text-xs text-gray-500">Create a store and its owner account together</p>
          </div>
        </div>

        <Alert message={serverError} onClose={() => setError('')} />

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Store Name
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Downtown Gourmet Grocery"
                className={`w-full pl-10 pr-3.5 py-2.5 bg-white border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">20–60 characters.</p>
            {errors.name && <p className="text-xs text-red-600 mt-0.5">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Store & Owner Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="storeowner@example.com"
                className={`w-full pl-10 pr-3.5 py-2.5 bg-white border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">The store owner will use this email to log in.</p>
            {errors.email && <p className="text-xs text-red-600 mt-0.5">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Store Address
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <textarea
                name="address"
                rows={2}
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter physical store location"
                className={`w-full pl-10 pr-3.5 py-2 bg-white border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.address ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Maximum 400 characters.</p>
            {errors.address && <p className="text-xs text-red-600 mt-0.5">{errors.address}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Store Owner Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full pl-10 pr-3.5 py-2.5 bg-white border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              8–16 characters with at least 1 uppercase and 1 special character.
            </p>
            {errors.password && <p className="text-xs text-red-600 mt-0.5">{errors.password}</p>}
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <Link
              to="/admin/stores"
              className="px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-xs disabled:opacity-50"
            >
              {submitting ? 'Creating Store & Owner...' : 'Create Store & Owner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
