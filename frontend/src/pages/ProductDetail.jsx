import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to fetch product", err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p style={{ padding: "2rem" }}>Loading...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      {product.image_url && (
        <img src={product.image_url} alt={product.name} style={{ width: "300px" }} />
      )}
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <p>Stock: {product.stock}</p>

      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <label>Quantity:</label>
        <input
          type="number"
          min="1"
          max={product.stock}
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          style={{ width: "60px" }}
        />
      </div>
      <br />
      <button onClick={() => { addToCart(product.id, quantity); navigate("/cart"); }}>
        Add to Cart
      </button>
      <button onClick={() => navigate(-1)} style={{ marginLeft: "1rem" }}>
        Back
      </button>
    </div>
  );
}

export default ProductDetail;