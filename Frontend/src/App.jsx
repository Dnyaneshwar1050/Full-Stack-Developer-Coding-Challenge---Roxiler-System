import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { NotFound } from './pages/NotFound';

// Shared Page
import { ChangePassword } from './pages/ChangePassword';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { CreateUser } from './pages/admin/CreateUser';
import { UserDetails } from './pages/admin/UserDetails';
import { AdminStores } from './pages/admin/AdminStores';
import { CreateStore } from './pages/admin/CreateStore';

// Normal User Pages
import { UserStores } from './pages/user/UserStores';

// Store Owner Pages
import { OwnerDashboard } from './pages/owner/OwnerDashboard';

// Smart root redirector based on authenticated user's role
function RoleRedirect() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (role === 'STORE_OWNER') {
    return <Navigate to="/store-owner/dashboard" replace />;
  }

  return <Navigate to="/stores" replace />;
}

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {user && <Navbar />}

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signup" element={<Navigate to="/register" replace />} />

          {/* Root Role Redirector */}
          <Route path="/" element={<RoleRedirect />} />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/new"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <CreateUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/:id"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <UserDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/stores"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminStores />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/stores/new"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <CreateStore />
              </ProtectedRoute>
            }
          />

          {/* Normal User Protected Routes */}
          <Route
            path="/stores"
            element={
              <ProtectedRoute allowedRoles={['NORMAL_USER', 'ADMIN']}>
                <UserStores />
              </ProtectedRoute>
            }
          />
          <Route path="/user/stores" element={<Navigate to="/stores" replace />} />

          {/* Store Owner Protected Routes */}
          <Route
            path="/store-owner/dashboard"
            element={
              <ProtectedRoute allowedRoles={['STORE_OWNER']}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Shared Authenticated Routes */}
          <Route
            path="/account/password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route path="/update-password" element={<Navigate to="/account/password" replace />} />

          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
