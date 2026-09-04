import { useState, useEffect } from "react";
import axiosInstance from "../../services/api";

export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/admin/stats");
      setStats(response.data);
      setError("");
    } catch (err) {
      setError("Failed to load dashboard statistics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>Loading...</div>
    );
  }

  const containerStyle = {
    padding: "30px",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const titleStyle = {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "30px",
    color: "#2c3e50",
  };

  const errorStyle = {
    backgroundColor: "#fadbd8",
    color: "#c0392b",
    padding: "15px",
    borderRadius: "4px",
    marginBottom: "20px",
  };

  const statsGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  };

  const statCardStyle = {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
    border: "2px solid #ecf0f1",
    transition: "all 0.3s",
  };

  const statNumberStyle = {
    fontSize: "48px",
    fontWeight: "bold",
    color: "#3498db",
    marginBottom: "10px",
  };

  const statLabelStyle = {
    fontSize: "16px",
    color: "#7f8c8d",
    fontWeight: "500",
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Admin Dashboard</h1>

      {error && <div style={errorStyle}>{error}</div>}

      {stats && (
        <div style={statsGridStyle}>
          <div
            style={statCardStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 4px 20px rgba(52,152,219,0.3)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)")
            }
          >
            <div style={statNumberStyle}>{stats.totalUsers}</div>
            <div style={statLabelStyle}>Total Users</div>
          </div>

          <div
            style={statCardStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 4px 20px rgba(46,204,113,0.3)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)")
            }
          >
            <div style={{ ...statNumberStyle, color: "#27ae60" }}>
              {stats.totalStores}
            </div>
            <div style={statLabelStyle}>Total Stores</div>
          </div>

          <div
            style={statCardStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 4px 20px rgba(241,196,15,0.3)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)")
            }
          >
            <div style={{ ...statNumberStyle, color: "#f39c12" }}>
              {stats.totalRatings}
            </div>
            <div style={statLabelStyle}>Total Ratings</div>
          </div>
        </div>
      )}
    </div>
  );
}
