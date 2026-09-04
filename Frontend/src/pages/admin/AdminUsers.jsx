import { useState, useEffect } from "react";
import axiosInstance from "../../services/api";

export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchAddress, setSearchAddress] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, searchName, searchEmail, searchAddress, roleFilter, sortConfig]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/admin/users");
      setUsers(response.data);
      setError("");
    } catch (err) {
      setError("Failed to load users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = users.filter((user) => {
      const matchName = user.name
        .toLowerCase()
        .includes(searchName.toLowerCase());
      const matchEmail = user.email
        .toLowerCase()
        .includes(searchEmail.toLowerCase());
      const matchAddress = user.address
        .toLowerCase()
        .includes(searchAddress.toLowerCase());
      const matchRole = roleFilter === "" || user.role === roleFilter;
      return matchName && matchEmail && matchAddress && matchRole;
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

    setFilteredUsers(filtered);
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

  const selectStyle = {
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

  const rowHoverStyle = {
    backgroundColor: "#f8f9fa",
  };

  const noResultsStyle = {
    padding: "40px",
    textAlign: "center",
    color: "#7f8c8d",
  };

  const roleStyle = {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return { backgroundColor: "#e8f4f8", color: "#2980b9" };
      case "normal":
        return { backgroundColor: "#e8f5e9", color: "#27ae60" };
      case "store_owner":
        return { backgroundColor: "#fff3e0", color: "#e67e22" };
      default:
        return { backgroundColor: "#f5f5f5", color: "#95a5a6" };
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Users Management</h1>

      {error && <div style={errorStyle}>{error}</div>}

      <div style={filterContainerStyle}>
        <div style={filterGroupStyle}>
          <label style={labelStyle}>Search by Name</label>
          <input
            type="text"
            style={inputStyle}
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Filter by name..."
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

        <div style={filterGroupStyle}>
          <label style={labelStyle}>Filter by Role</label>
          <select
            style={selectStyle}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="normal">Normal User</option>
            <option value="store_owner">Store Owner</option>
          </select>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div style={noResultsStyle}>No users found</div>
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
                <th style={thStyle} onClick={() => handleSort("role")}>
                  Role{" "}
                  {sortConfig.key === "role" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f8f9fa")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "white")
                  }
                >
                  <td style={tdStyle}>{user.name}</td>
                  <td style={tdStyle}>{user.email}</td>
                  <td style={tdStyle}>{user.address}</td>
                  <td style={tdStyle}>
                    <span style={{ ...roleStyle, ...getRoleColor(user.role) }}>
                      {user.role === "store_owner"
                        ? "Store Owner"
                        : user.role.charAt(0).toUpperCase() +
                          user.role.slice(1)}
                    </span>
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
