import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

function Checkout() {
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError("");
    try {
      await api.post("/orders");
      clearCart();
      navigate("/orders");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) return (
    <div style={{ padding: "2rem" }}>
      <h2>Checkout</h2>
      <p>Your cart is empty.</p>
      <button onClick={() => navigate("/")}>Go Shopping</button>
    </div>
  );

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Checkout</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>Order Summary</h3>
      {cart.map((item) => (
        <div key={item.id} style={{ borderBottom: "1px solid #ccc", paddingBottom: "0.5rem", marginBottom: "0.5rem" }}>
          <p>{item.product.name} x {item.quantity} — ${(item.product.price * item.quantity).toFixed(2)}</p>
        </div>
      ))}

      <h3>Total: ${total.toFixed(2)}</h3>
      <button onClick={handlePlaceOrder} disabled={loading}>
        {loading ? "Placing Order..." : "Place Order"}
      </button>
      <button onClick={() => navigate("/cart")} style={{ marginLeft: "1rem" }}>
        Back to Cart
      </button>
    </div>
  );
}

export default Checkout;