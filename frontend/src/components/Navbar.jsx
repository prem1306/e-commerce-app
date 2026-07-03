import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{ display: "flex", gap: "1rem", padding: "1rem", background: "#333", color: "white" }}>
      <Link to="/" style={{ color: "white" }}>Home</Link>

      {user && (
        <>
          <Link to="/cart" style={{ color: "white" }}>Cart ({cartCount})</Link>
          <Link to="/orders" style={{ color: "white" }}>Orders</Link>
        </>
      )}

      {isAdmin && (
        <Link to="/admin" style={{ color: "white" }}>Admin</Link>
      )}

      {user ? (
        <>
          <span>Hi, {user.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ color: "white" }}>Login</Link>
          <Link to="/register" style={{ color: "white" }}>Register</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;