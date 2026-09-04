import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Navbar } from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Auth pages
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { UpdatePassword } from "./pages/UpdatePassword";
import { Unauthorized } from "./pages/Unauthorized";

// Admin pages
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { AdminStores } from "./pages/admin/AdminStores";
import { AddUser } from "./pages/admin/AddUser";
import { AddStore } from "./pages/admin/AddStore";

// User pages
import { UserStores } from "./pages/user/UserStores";

// Store Owner pages
import { StoreOwnerDashboard } from "./pages/storeOwner/StoreOwnerDashboard";

function AppContent() {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Redirect to appropriate dashboard */}
        <Route
          path="/"
          element={
            user ? (
              user.role === "admin" ? (
                <Navigate to="/admin/dashboard" />
              ) : user.role === "normal" ? (
                <Navigate to="/user/stores" />
              ) : user.role === "store_owner" ? (
                <Navigate to="/store-owner/dashboard" />
              ) : null
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/stores"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminStores />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-user"
          element={
            <ProtectedRoute requiredRole="admin">
              <AddUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-store"
          element={
            <ProtectedRoute requiredRole="admin">
              <AddStore />
            </ProtectedRoute>
          }
        />

        {/* Normal user routes */}
        <Route
          path="/user/stores"
          element={
            <ProtectedRoute requiredRole="normal">
              <UserStores />
            </ProtectedRoute>
          }
        />

        {/* Store owner routes */}
        <Route
          path="/store-owner/dashboard"
          element={
            <ProtectedRoute requiredRole="store_owner">
              <StoreOwnerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Shared routes */}
        <Route
          path="/update-password"
          element={
            <ProtectedRoute>
              <UpdatePassword />
            </ProtectedRoute>
          }
        />

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
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
