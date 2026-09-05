import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Store, LogOut, KeyRound, User as UserIcon, Menu, X, Shield, ShoppingBag } from 'lucide-react';

export const Navbar = () => {
  const { user, role, logout, isAdmin, isNormalUser, isStoreOwner } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const roleLabel = {
    ADMIN: 'Admin',
    NORMAL_USER: 'User',
    STORE_OWNER: 'Store Owner',
  }[role] || 'Member';

  const roleBadgeColor = {
    ADMIN: 'bg-purple-100 text-purple-700 border-purple-200',
    NORMAL_USER: 'bg-blue-100 text-blue-700 border-blue-200',
    STORE_OWNER: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  }[role] || 'bg-gray-100 text-gray-700 border-gray-200';

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Store className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900 tracking-tight leading-tight">
                  Store<span className="text-blue-600">Rate</span>
                </span>
                <span className="text-xs text-gray-600 hidden sm:block">Rating Platform</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 ml-8">
              {isAdmin && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/admin/dashboard')
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/users"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/admin/users') || location.pathname.startsWith('/admin/users')
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Users
                  </Link>
                  <Link
                    to="/admin/stores"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/admin/stores') || location.pathname.startsWith('/admin/stores')
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Stores
                  </Link>
                </>
              )}

              {isNormalUser && (
                <Link
                  to="/stores"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/stores')
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Browse Stores
                </Link>
              )}

              {isStoreOwner && (
                <Link
                  to="/store-owner/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/store-owner/dashboard')
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  My Store
                </Link>
              )}
            </nav>
          </div>

          {/* Right Side: User Profile & Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {user && (
              <div className="flex items-center space-x-2 mr-2">
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-800 leading-none">
                    {user.name || user.email}
                  </div>
                  <div className="text-xs text-gray-600 mt-0.5">{user.email}</div>
                </div>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${roleBadgeColor}`}>
                  {roleLabel}
                </span>
              </div>
            )}

            <Link
              to="/account/password"
              className={`p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors flex items-center space-x-1 text-sm ${
                isActive('/account/password') ? 'bg-gray-100 text-gray-900' : ''
              }`}
              title="Change Password"
            >
              <KeyRound className="w-4 h-4" />
              <span className="hidden lg:inline">Password</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 px-4 pt-3 pb-4 bg-white space-y-2">
          {user && (
            <div className="pb-3 border-b border-gray-100">
              <div className="font-semibold text-gray-800">{user.name || user.email}</div>
              <div className="text-xs text-gray-600">{user.email}</div>
              <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded font-medium border ${roleBadgeColor}`}>
                {roleLabel}
              </span>
            </div>
          )}

          {isAdmin && (
            <>
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Dashboard
              </Link>
              <Link
                to="/admin/users"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Users List
              </Link>
              <Link
                to="/admin/stores"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Stores List
              </Link>
            </>
          )}

          {isNormalUser && (
            <Link
              to="/stores"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Browse Stores
            </Link>
          )}

          {isStoreOwner && (
            <Link
              to="/store-owner/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              My Store Dashboard
            </Link>
          )}

          <div className="pt-2 border-t border-gray-100 space-y-1">
            <Link
              to="/account/password"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              <KeyRound className="w-4 h-4" />
              <span>Change Password</span>
            </Link>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full text-left flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
