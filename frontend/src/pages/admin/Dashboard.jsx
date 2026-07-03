import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Admin Dashboard</h2>
      {stats ? (
        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ border: "1px solid #ccc", padding: "1rem", width: "150px" }}>
            <h3>Users</h3>
            <p style={{ fontSize: "2rem" }}>{stats.total_users}</p>
          </div>
          <div style={{ border: "1px solid #ccc", padding: "1rem", width: "150px" }}>
            <h3>Products</h3>
            <p style={{ fontSize: "2rem" }}>{stats.total_products}</p>
          </div>
          <div style={{ border: "1px solid #ccc", padding: "1rem", width: "150px" }}>
            <h3>Orders</h3>
            <p style={{ fontSize: "2rem" }}>{stats.total_orders}</p>
          </div>
          <div style={{ border: "1px solid #ccc", padding: "1rem", width: "150px" }}>
            <h3>Revenue</h3>
            <p style={{ fontSize: "2rem" }}>${stats.total_revenue.toFixed(2)}</p>
          </div>
        </div>
      ) : (
        <p>Loading stats...</p>
      )}
      <br />
      <div style={{ display: "flex", gap: "1rem" }}>
        <button onClick={() => navigate("/admin/products")}>Manage Products</button>
        <button onClick={() => navigate("/admin/orders")}>Manage Orders</button>
      </div>
    </div>
  );
}

export default Dashboard;