import { useState, useEffect } from "react";
import api from "../api/axios";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders");
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p style={{ padding: "2rem" }}>Loading...</p>;

  if (orders.length === 0) return (
    <div style={{ padding: "2rem" }}>
      <h2>Your Orders</h2>
      <p>You have no orders yet.</p>
    </div>
  );

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Your Orders</h2>
      {orders.map((order) => (
        <div key={order.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
          <h3>Order #{order.id}</h3>
          <p>Status: {order.status}</p>
          <p>Total: ${order.total.toFixed(2)}</p>
          <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
          <h4>Items:</h4>
          {order.items.map((item) => (
            <div key={item.id} style={{ paddingLeft: "1rem" }}>
              <p>{item.product.name} x {item.quantity} — ${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Orders;