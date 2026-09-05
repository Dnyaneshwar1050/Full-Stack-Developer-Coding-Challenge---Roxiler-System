import React, { useState, useEffect } from 'react';
import { storesAPI } from '../../api/endpoints';
import { Loading } from '../../components/Loading';
import { Alert } from '../../components/Alert';
import { StarRating } from '../../components/StarRating';
import { Store, Search, MapPin, CheckCircle2 } from 'lucide-react';

export const UserStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [submittingId, setSubmittingId] = useState(null);
  const [successToast, setSuccessToast] = useState('');

  // Local state for user's pending star ratings per store { [storeId]: rating }
  const [pendingRatings, setPendingRatings] = useState({});

  const fetchStores = async () => {
    try {
      setLoading(true);
      const res = await storesAPI.getStores();
      const list = Array.isArray(res.data) ? res.data : [];
      setStores(list);

      // Initialize pending ratings from existing userRatings
      const initialRatings = {};
      list.forEach((s) => {
        if (s.userRating) {
          initialRatings[s.id] = s.userRating;
        }
      });
      setPendingRatings(initialRatings);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleRateSelect = (storeId, rating) => {
    setPendingRatings((prev) => ({
      ...prev,
      [storeId]: rating,
    }));
  };

  const handleRatingSubmit = async (storeId) => {
    const ratingValue = pendingRatings[storeId];
    if (!ratingValue) {
      alert('Please select a rating between 1 and 5 stars');
      return;
    }

    setSubmittingId(storeId);
    setError('');
    try {
      const res = await storesAPI.submitRating(storeId, ratingValue);
      const updatedRating = res.data.rating;
      const updatedAvg = res.data.average;

      // Update state in place
      setStores((prev) =>
        prev.map((s) => {
          if (s.id === storeId) {
            return {
              ...s,
              userRating: updatedRating,
              averageRating: updatedAvg !== undefined ? updatedAvg : s.averageRating,
            };
          }
          return s;
        })
      );

      setSuccessToast('Rating saved successfully!');
      setTimeout(() => setSuccessToast(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmittingId(null);
    }
  };

  const filteredStores = stores.filter((s) => {
    const term = searchTerm.toLowerCase();
    return (
      (s.name && s.name.toLowerCase().includes(term)) ||
      (s.address && s.address.toLowerCase().includes(term))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse & Rate Stores</h1>
          <p className="text-sm text-gray-500 mt-1">
            Discover community stores, check average ratings, and submit your reviews.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search store name, address..."
            className="w-full pl-10 pr-3.5 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <Alert message={error} onClose={() => setError('')} />
      {successToast && (
        <div className="mt-4 flex items-center space-x-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Store Cards Grid */}
      <div className="mt-6">
        {loading ? (
          <Loading text="Loading community stores..." />
        ) : filteredStores.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-xs">
            <Store className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-600 text-base font-medium">No stores match your search</p>
            <p className="text-gray-400 text-xs mt-1">Try typing a different name or location</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((store) => {
              const currentPending = pendingRatings[store.id] || 0;
              const hasRatedBefore = Boolean(store.userRating);
              const isChanged = currentPending !== (store.userRating || 0);

              return (
                <div
                  key={store.id}
                  className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between hover:border-gray-300 transition-all"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold text-gray-900 leading-tight">
                          {store.name}
                        </h3>
                        <div className="flex items-center text-xs text-gray-500 mt-1.5 space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="line-clamp-2">{store.address}</span>
                        </div>
                      </div>
                      <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Store className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Overall Average Rating */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Overall Rating
                      </span>
                      <StarRating
                        value={store.averageRating}
                        readOnly
                        size="sm"
                        showLabel={true}
                      />
                    </div>
                  </div>

                  {/* Rating Box */}
                  <div className="mt-5 pt-4 border-t border-gray-100 bg-gray-50/70 -mx-5 -mb-5 p-4 rounded-b-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-700">
                        {hasRatedBefore ? 'Your Rating' : 'Rate this store'}
                      </span>
                      {hasRatedBefore && (
                        <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded">
                          Rated {store.userRating}★
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <StarRating
                        value={currentPending}
                        onChange={(val) => handleRateSelect(store.id, val)}
                        size="md"
                        showLabel={false}
                      />

                      <button
                        onClick={() => handleRatingSubmit(store.id)}
                        disabled={submittingId === store.id || (!isChanged && hasRatedBefore)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors shadow-xs ${
                          isChanged || !hasRatedBefore
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {submittingId === store.id
                          ? 'Saving...'
                          : hasRatedBefore
                          ? isChanged
                            ? 'Update'
                            : 'Saved'
                          : 'Submit'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
