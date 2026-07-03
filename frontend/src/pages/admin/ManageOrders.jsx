import { useState, useEffect } from "react";
import api from "../../api/axios";

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/admin/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (order_id, status) => {
    try {
      await api.put(`/admin/orders/${order_id}?status=${status}`);
      fetchOrders();
    } catch (err) {
      console.error("Failed to update order status", err);
    }
  };

  if (loading) return <p style={{ padding: "2rem" }}>Loading...</p>;

  if (orders.length === 0) return (
    <div style={{ padding: "2rem" }}>
      <h2>Manage Orders</h2>
      <p>No orders yet.</p>
    </div>
  );

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Manage Orders</h2>
      {orders.map((order) => (
        <div key={order.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
          <h3>Order #{order.id}</h3>
          <p>User ID: {order.user_id}</p>
          <p>Total: ${order.total.toFixed(2)}</p>
          <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
          <p>Status: <strong>{order.status}</strong></p>

          <h4>Items:</h4>
          {order.items.map((item) => (
            <div key={item.id} style={{ paddingLeft: "1rem" }}>
              <p>{item.product.name} x {item.quantity} — ${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}

          <div style={{ marginTop: "0.5rem" }}>
            <label>Update Status: </label>
            <select
              value={order.status}
              onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ManageOrders;