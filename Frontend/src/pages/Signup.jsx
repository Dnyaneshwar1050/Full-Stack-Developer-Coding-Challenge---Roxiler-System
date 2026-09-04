import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axiosInstance from "../services/api";

export function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (name.length < 20 || name.length > 60) {
      setError("Name must be between 20 and 60 characters");
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format");
      return;
    }

    if (!address.trim()) {
      setError("Address is required");
      return;
    }

    if (address.length > 400) {
      setError("Address must not exceed 400 characters");
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    if (password.length < 8 || password.length > 16) {
      setError("Password must be between 8 and 16 characters");
      return;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
      password,
    );

    if (!hasUpperCase) {
      setError("Password must contain at least one uppercase letter");
      return;
    }

    if (!hasSpecialChar) {
      setError("Password must contain at least one special character");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/signup", {
        name,
        email,
        address,
        password,
      });
      const { user, token } = response.data;
      login(user, token);
      navigate("/user/stores");
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#ecf0f1",
    padding: "20px",
  };

  const formContainerStyle = {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "450px",
  };

  const titleStyle = {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "30px",
    textAlign: "center",
    color: "#2c3e50",
  };

  const formGroupStyle = {
    marginBottom: "20px",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontWeight: "500",
    color: "#34495e",
    fontSize: "14px",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    border: "1px solid #bdc3c7",
    borderRadius: "4px",
    fontSize: "14px",
    boxSizing: "border-box",
  };

  const errorStyle = {
    backgroundColor: "#fadbd8",
    color: "#c0392b",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "20px",
    fontSize: "14px",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    backgroundColor: "#27ae60",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  };

  const linkStyle = {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "14px",
  };

  const loginLinkStyle = {
    color: "#3498db",
    textDecoration: "none",
    fontWeight: "bold",
  };

  const helperStyle = {
    fontSize: "12px",
    color: "#7f8c8d",
    marginTop: "5px",
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h1 style={titleStyle}>Sign Up</h1>
        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Name</label>
            <input
              type="text"
              style={inputStyle}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
            />
            <div style={helperStyle}>20-60 characters</div>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              style={inputStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Address</label>
            <textarea
              style={{
                ...inputStyle,
                minHeight: "80px",
                fontFamily: "inherit",
              }}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
            />
            <div style={helperStyle}>Max 400 characters</div>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              style={inputStyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            <div style={helperStyle}>
              8-16 characters, 1 uppercase, 1 special character
            </div>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Confirm Password</label>
            <input
              type="password"
              style={inputStyle}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            style={buttonStyle}
            disabled={loading}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#229954")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#27ae60")}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div style={linkStyle}>
          Already have an account?{" "}
          <Link to="/login" style={loginLinkStyle}>
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
