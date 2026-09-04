import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function Unauthorized() {
  const { user } = useAuth();

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#ecf0f1",
    textAlign: "center",
    padding: "20px",
  };

  const boxStyle = {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    maxWidth: "500px",
  };

  const titleStyle = {
    fontSize: "48px",
    fontWeight: "bold",
    color: "#e74c3c",
    marginBottom: "20px",
  };

  const messageStyle = {
    fontSize: "18px",
    color: "#7f8c8d",
    marginBottom: "30px",
    lineHeight: "1.6",
  };

  const linkStyle = {
    display: "inline-block",
    padding: "12px 24px",
    backgroundColor: "#3498db",
    color: "white",
    textDecoration: "none",
    borderRadius: "4px",
    fontWeight: "bold",
    fontSize: "16px",
  };

  const getDefaultLink = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "normal") return "/user/stores";
    if (user.role === "store_owner") return "/store-owner/dashboard";
    return "/login";
  };

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <div style={titleStyle}>403</div>
        <p style={messageStyle}>
          Oops! You don't have permission to access this page.
        </p>
        <Link to={getDefaultLink()} style={linkStyle}>
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
