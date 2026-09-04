import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/api";

export function AddStore() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Store name is required");
      return;
    }

    if (name.length < 20 || name.length > 60) {
      setError("Store name must be between 20 and 60 characters");
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

    setLoading(true);
    try {
      await axiosInstance.post("/admin/add-store", {
        name,
        email,
        address,
        password,
      });
      navigate("/admin/stores");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add store");
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    padding: "30px 20px",
    minHeight: "calc(100vh - 80px)",
    backgroundColor: "#ecf0f1",
  };

  const formContainerStyle = {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "500px",
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
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  };

  const helperStyle = {
    fontSize: "12px",
    color: "#7f8c8d",
    marginTop: "5px",
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h1 style={titleStyle}>Add New Store</h1>
        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Store Name</label>
            <input
              type="text"
              style={inputStyle}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter store name"
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
              placeholder="Enter store email"
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
              placeholder="Enter store address"
            />
            <div style={helperStyle}>Max 400 characters</div>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Password (for store owner login)</label>
            <input
              type="password"
              style={inputStyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
            <div style={helperStyle}>
              8-16 characters, 1 uppercase, 1 special character
            </div>
          </div>

          <button
            type="submit"
            style={buttonStyle}
            disabled={loading}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#2980b9")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#3498db")}
          >
            {loading ? "Adding..." : "Add Store"}
          </button>
        </form>
      </div>
    </div>
  );
}
