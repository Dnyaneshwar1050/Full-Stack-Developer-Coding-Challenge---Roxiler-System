import { useState, useEffect } from "react";
import axiosInstance from "../../services/api";

export function UserStores() {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchAddress, setSearchAddress] = useState("");
  const [ratings, setRatings] = useState({});
  const [submittingId, setSubmittingId] = useState(null);
  const [ratingInputs, setRatingInputs] = useState({});
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [stores, searchName, searchAddress, sortConfig]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/store/list");
      setStores(response.data);

      const initialRatings = {};
      const initialInputs = {};
      response.data.forEach((store) => {
        initialRatings[store.id] = store.userRating || null;
        initialInputs[store.id] = store.userRating || "";
      });
      setRatings(initialRatings);
      setRatingInputs(initialInputs);
      setError("");
    } catch (err) {
      setError("Failed to load stores");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = stores.filter((store) => {
      const matchName = store.name
        .toLowerCase()
        .includes(searchName.toLowerCase());
      const matchAddress = store.address
        .toLowerCase()
        .includes(searchAddress.toLowerCase());
      return matchName && matchAddress;
    });

    filtered.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredStores(filtered);
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const handleRatingSubmit = async (storeId) => {
    const rating = ratingInputs[storeId];

    if (!rating) {
      alert("Please select a rating");
      return;
    }

    if (rating < 1 || rating > 5) {
      alert("Rating must be between 1 and 5");
      return;
    }

    setSubmittingId(storeId);
    try {
      const method = ratings[storeId] ? "put" : "post";
      const endpoint = ratings[storeId]
        ? `/rating/${storeId}/update`
        : "/rating/submit";

      await axiosInstance[method](endpoint, {
        storeId,
        rating: parseInt(rating),
      });

      setRatings({ ...ratings, [storeId]: rating });
      alert(
        ratings[storeId]
          ? "Rating updated successfully"
          : "Rating submitted successfully",
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit rating");
    } finally {
      setSubmittingId(null);
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

  const filterContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
    marginBottom: "25px",
    backgroundColor: "#f8f9fa",
    padding: "20px",
    borderRadius: "8px",
  };

  const filterGroupStyle = {
    display: "flex",
    flexDirection: "column",
  };

  const labelStyle = {
    fontSize: "14px",
    fontWeight: "500",
    marginBottom: "5px",
    color: "#34495e",
  };

  const inputStyle = {
    padding: "8px",
    border: "1px solid #bdc3c7",
    borderRadius: "4px",
    fontSize: "14px",
  };

  const storesGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "20px",
  };

  const storeCardStyle = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    border: "1px solid #ecf0f1",
  };

  const storeNameStyle = {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: "10px",
  };

  const storeInfoStyle = {
    fontSize: "13px",
    color: "#7f8c8d",
    marginBottom: "8px",
    lineHeight: "1.6",
  };

  const ratingContainerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "15px",
    paddingTop: "15px",
    borderTop: "1px solid #ecf0f1",
  };

  const ratingDisplayStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const ratingBadgeStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#fff3cd",
    color: "#856404",
    fontWeight: "bold",
    fontSize: "16px",
  };

  const ratingFormStyle = {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  };

  const selectStyle = {
    padding: "6px 8px",
    border: "1px solid #bdc3c7",
    borderRadius: "4px",
    fontSize: "13px",
  };

  const buttonStyle = {
    padding: "6px 12px",
    backgroundColor: "#27ae60",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "13px",
    fontWeight: "bold",
    cursor: "pointer",
  };

  const noResultsStyle = {
    padding: "40px",
    textAlign: "center",
    color: "#7f8c8d",
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Available Stores</h1>

      {error && <div style={errorStyle}>{error}</div>}

      <div style={filterContainerStyle}>
        <div style={filterGroupStyle}>
          <label style={labelStyle}>Search by Store Name</label>
          <input
            type="text"
            style={inputStyle}
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Filter by store name..."
          />
        </div>

        <div style={filterGroupStyle}>
          <label style={labelStyle}>Search by Address</label>
          <input
            type="text"
            style={inputStyle}
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            placeholder="Filter by address..."
          />
        </div>
      </div>

      {filteredStores.length === 0 ? (
        <div style={noResultsStyle}>No stores found</div>
      ) : (
        <div style={storesGridStyle}>
          {filteredStores.map((store) => (
            <div
              key={store.id}
              style={storeCardStyle}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(0,0,0,0.15)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)")
              }
            >
              <div style={storeNameStyle}>{store.name}</div>
              <div style={storeInfoStyle}>
                <strong>Email:</strong> {store.email}
              </div>
              <div style={storeInfoStyle}>
                <strong>Address:</strong> {store.address}
              </div>

              <div style={ratingContainerStyle}>
                <div style={ratingDisplayStyle}>
                  <span style={{ fontSize: "13px", fontWeight: "500" }}>
                    Avg Rating:
                  </span>
                  <div style={ratingBadgeStyle}>
                    {typeof store.averageRating === "number"
                      ? store.averageRating.toFixed(1)
                      : "N/A"}
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: "15px",
                  paddingTop: "15px",
                  borderTop: "1px solid #ecf0f1",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "500",
                    marginBottom: "8px",
                  }}
                >
                  {ratings[store.id]
                    ? `Your Rating: ${ratings[store.id]}/5`
                    : "No rating yet"}
                </div>
                <div style={ratingFormStyle}>
                  <select
                    style={selectStyle}
                    value={ratingInputs[store.id] || ""}
                    onChange={(e) =>
                      setRatingInputs({
                        ...ratingInputs,
                        [store.id]: e.target.value,
                      })
                    }
                  >
                    <option value="">Select rating...</option>
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                  <button
                    style={buttonStyle}
                    onClick={() => handleRatingSubmit(store.id)}
                    disabled={submittingId === store.id}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#229954")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#27ae60")
                    }
                  >
                    {submittingId === store.id ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
