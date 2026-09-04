import { useState, useEffect } from "react";
import axiosInstance from "../../services/api";

export function AdminStores() {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchAddress, setSearchAddress] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [stores, searchName, searchEmail, searchAddress, sortConfig]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/admin/stores");
      setStores(response.data);
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
      const matchEmail = store.email
        .toLowerCase()
        .includes(searchEmail.toLowerCase());
      const matchAddress = store.address
        .toLowerCase()
        .includes(searchAddress.toLowerCase());
      return matchName && matchEmail && matchAddress;
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

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>Loading...</div>
    );
  }

  const containerStyle = {
    padding: "30px",
    maxWidth: "1400px",
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
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
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

  const tableContainerStyle = {
    overflowX: "auto",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  };

  const thStyle = {
    padding: "15px",
    backgroundColor: "#2c3e50",
    color: "white",
    textAlign: "left",
    fontWeight: "bold",
    cursor: "pointer",
    userSelect: "none",
    whiteSpace: "nowrap",
  };

  const tdStyle = {
    padding: "12px 15px",
    borderBottom: "1px solid #ecf0f1",
  };

  const noResultsStyle = {
    padding: "40px",
    textAlign: "center",
    color: "#7f8c8d",
  };

  const ratingStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "#fff3cd",
    color: "#856404",
    fontWeight: "bold",
    fontSize: "14px",
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Stores Management</h1>

      {error && <div style={errorStyle}>{error}</div>}

      <div style={filterContainerStyle}>
        <div style={filterGroupStyle}>
          <label style={labelStyle}>Search by Name</label>
          <input
            type="text"
            style={inputStyle}
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Filter by store name..."
          />
        </div>

        <div style={filterGroupStyle}>
          <label style={labelStyle}>Search by Email</label>
          <input
            type="text"
            style={inputStyle}
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            placeholder="Filter by email..."
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
        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr style={{ backgroundColor: "#2c3e50" }}>
                <th style={thStyle} onClick={() => handleSort("name")}>
                  Name{" "}
                  {sortConfig.key === "name" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th style={thStyle} onClick={() => handleSort("email")}>
                  Email{" "}
                  {sortConfig.key === "email" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th style={thStyle} onClick={() => handleSort("address")}>
                  Address{" "}
                  {sortConfig.key === "address" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th style={thStyle} onClick={() => handleSort("averageRating")}>
                  Rating{" "}
                  {sortConfig.key === "averageRating" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStores.map((store) => (
                <tr
                  key={store.id}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f8f9fa")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "white")
                  }
                >
                  <td style={tdStyle}>{store.name}</td>
                  <td style={tdStyle}>{store.email}</td>
                  <td style={tdStyle}>{store.address}</td>
                  <td style={tdStyle}>
                    <div style={ratingStyle}>
                      {typeof store.averageRating === "number"
                        ? store.averageRating.toFixed(1)
                        : "N/A"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
