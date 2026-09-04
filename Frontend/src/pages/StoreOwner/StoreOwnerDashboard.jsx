import { useState, useEffect } from "react";
import axiosInstance from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

export function StoreOwnerDashboard() {
  const [raters, setRaters] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/store-owner/dashboard");
      setRaters(response.data.raters || []);
      setAverageRating(response.data.averageRating || 0);
      setError("");
    } catch (err) {
      setError("Failed to load dashboard data");
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
    marginBottom: "10px",
    color: "#2c3e50",
  };

  const subtitleStyle = {
    fontSize: "16px",
    color: "#7f8c8d",
    marginBottom: "30px",
  };

  const errorStyle = {
    backgroundColor: "#fadbd8",
    color: "#c0392b",
    padding: "15px",
    borderRadius: "4px",
    marginBottom: "20px",
  };

  const statsContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  };

  const statCardStyle = {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
    border: "2px solid #ecf0f1",
  };

  const statNumberStyle = {
    fontSize: "48px",
    fontWeight: "bold",
    color: "#f39c12",
    marginBottom: "10px",
  };

  const statLabelStyle = {
    fontSize: "16px",
    color: "#7f8c8d",
    fontWeight: "500",
  };

  const ratingsListStyle = {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    overflow: "hidden",
  };

  const sectionTitleStyle = {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#2c3e50",
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderBottom: "2px solid #ecf0f1",
    margin: "0",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  };

  const thStyle = {
    padding: "15px 20px",
    backgroundColor: "#f8f9fa",
    textAlign: "left",
    fontWeight: "bold",
    color: "#2c3e50",
    borderBottom: "2px solid #ecf0f1",
  };

  const tdStyle = {
    padding: "12px 20px",
    borderBottom: "1px solid #ecf0f1",
  };

  const ratingBadgeStyle = (rating) => {
    let bgColor = "#fff3cd";
    if (rating >= 4) bgColor = "#d5f4e6";
    else if (rating >= 3) bgColor = "#e8f4f8";

    return {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      backgroundColor: bgColor,
      fontWeight: "bold",
      fontSize: "14px",
    };
  };

  const noResultsStyle = {
    padding: "40px",
    textAlign: "center",
    color: "#7f8c8d",
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Store Dashboard</h1>
      <p style={subtitleStyle}>
        Store: <strong>{user?.name}</strong>
      </p>

      {error && <div style={errorStyle}>{error}</div>}

      <div style={statsContainerStyle}>
        <div
          style={statCardStyle}
          onMouseEnter={(e) =>
            (e.currentTarget.style.boxShadow =
              "0 4px 20px rgba(243,156,18,0.3)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)")
          }
        >
          <div style={statNumberStyle}>{averageRating.toFixed(1)}</div>
          <div style={statLabelStyle}>Average Rating</div>
          <div style={{ fontSize: "12px", color: "#95a5a6", marginTop: "8px" }}>
            out of 5
          </div>
        </div>

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
          <div style={{ ...statNumberStyle, color: "#3498db" }}>
            {raters.length}
          </div>
          <div style={statLabelStyle}>Total Ratings</div>
        </div>
      </div>

      <div style={ratingsListStyle}>
        <h2 style={sectionTitleStyle}>User Ratings</h2>
        {raters.length === 0 ? (
          <div style={noResultsStyle}>No ratings yet</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>User Name</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Rating</th>
                  <th style={thStyle}>Submitted On</th>
                </tr>
              </thead>
              <tbody>
                {raters.map((rater) => (
                  <tr
                    key={rater.id}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f8f9fa")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "white")
                    }
                  >
                    <td style={tdStyle}>{rater.userName}</td>
                    <td style={tdStyle}>{rater.userEmail}</td>
                    <td style={tdStyle}>
                      <div style={ratingBadgeStyle(rater.rating)}>
                        {rater.rating}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      {new Date(rater.submittedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
