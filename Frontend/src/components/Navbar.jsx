import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 20px",
    backgroundColor: "#2c3e50",
    color: "white",
    borderBottom: "2px solid #3498db",
  };

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    marginRight: "20px",
    cursor: "pointer",
    fontSize: "14px",
  };

  const linkHoverStyle = {
    color: "#3498db",
  };

  const logoutButtonStyle = {
    padding: "8px 16px",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  };

  const leftLinksStyle = {
    display: "flex",
    alignItems: "center",
  };

  const titleStyle = {
    fontSize: "18px",
    fontWeight: "bold",
    marginRight: "30px",
  };

  return (
    <nav style={navStyle}>
      <div style={leftLinksStyle}>
        <div style={titleStyle}>Store Rating</div>

        {user.role === "admin" && (
          <>
            <Link
              to="/admin/dashboard"
              style={linkStyle}
              onMouseEnter={(e) => (e.target.style.color = "#3498db")}
              onMouseLeave={(e) => (e.target.style.color = "white")}
            >
              Dashboard
            </Link>
            <Link
              to="/admin/users"
              style={linkStyle}
              onMouseEnter={(e) => (e.target.style.color = "#3498db")}
              onMouseLeave={(e) => (e.target.style.color = "white")}
            >
              Users
            </Link>
            <Link
              to="/admin/stores"
              style={linkStyle}
              onMouseEnter={(e) => (e.target.style.color = "#3498db")}
              onMouseLeave={(e) => (e.target.style.color = "white")}
            >
              Stores
            </Link>
            <Link
              to="/admin/add-user"
              style={linkStyle}
              onMouseEnter={(e) => (e.target.style.color = "#3498db")}
              onMouseLeave={(e) => (e.target.style.color = "white")}
            >
              + Add User
            </Link>
            <Link
              to="/admin/add-store"
              style={linkStyle}
              onMouseEnter={(e) => (e.target.style.color = "#3498db")}
              onMouseLeave={(e) => (e.target.style.color = "white")}
            >
              + Add Store
            </Link>
          </>
        )}

        {user.role === "normal" && (
          <Link
            to="/user/stores"
            style={linkStyle}
            onMouseEnter={(e) => (e.target.style.color = "#3498db")}
            onMouseLeave={(e) => (e.target.style.color = "white")}
          >
            Stores
          </Link>
        )}

        {user.role === "store_owner" && (
          <Link
            to="/store-owner/dashboard"
            style={linkStyle}
            onMouseEnter={(e) => (e.target.style.color = "#3498db")}
            onMouseLeave={(e) => (e.target.style.color = "white")}
          >
            Dashboard
          </Link>
        )}

        {(user.role === "normal" || user.role === "store_owner") && (
          <Link
            to="/update-password"
            style={linkStyle}
            onMouseEnter={(e) => (e.target.style.color = "#3498db")}
            onMouseLeave={(e) => (e.target.style.color = "white")}
          >
            Change Password
          </Link>
        )}

        {user.role === "admin" && (
          <Link
            to="/update-password"
            style={linkStyle}
            onMouseEnter={(e) => (e.target.style.color = "#3498db")}
            onMouseLeave={(e) => (e.target.style.color = "white")}
          >
            Change Password
          </Link>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ marginRight: "15px", fontSize: "14px" }}>
          {user.name}
        </span>
        <button
          style={logoutButtonStyle}
          onClick={handleLogout}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#c0392b")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#e74c3c")}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
