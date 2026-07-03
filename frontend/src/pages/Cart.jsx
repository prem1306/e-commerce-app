import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { cart, removeFromCart, cartCount } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (cart.length === 0) return (
    <div style={{ padding: "2rem" }}>
      <h2>Your Cart</h2>
      <p>Your cart is empty.</p>
      <button onClick={() => navigate("/")}>Continue Shopping</button>
    </div>
  );

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Your Cart ({cartCount} items)</h2>
      {cart.map((item) => (
        <div key={item.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
          <h3>{item.product.name}</h3>
          <p>Price: ${item.product.price}</p>
          <p>Quantity: {item.quantity}</p>
          <p>Subtotal: ${(item.product.price * item.quantity).toFixed(2)}</p>
          <button onClick={() => removeFromCart(item.id)}>Remove</button>
        </div>
      ))}
      <h3>Total: ${total.toFixed(2)}</h3>
      <button onClick={() => navigate("/checkout")}>Proceed to Checkout</button>
    </div>
  );
}

export default Cart;