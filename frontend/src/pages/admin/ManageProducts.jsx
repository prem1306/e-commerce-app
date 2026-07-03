import { useState, useEffect } from "react";
import api from "../../api/axios";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image_url: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock)
      };
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post("/products", payload);
      }
      setForm({ name: "", description: "", price: "", stock: "", image_url: "" });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      setError("Failed to save product");
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      stock: product.stock,
      image_url: product.image_url || ""
    });
    setEditingId(product.id);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Manage Products</h2>

      <h3>{editingId ? "Edit Product" : "Add Product"}</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <br /><br />
        <input placeholder="Description" value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <br /><br />
        <input placeholder="Price" type="number" value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        <br /><br />
        <input placeholder="Stock" type="number" value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
        <br /><br />
        <input placeholder="Image URL" value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
        <br /><br />
        <button type="submit">{editingId ? "Update Product" : "Add Product"}</button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setForm({ name: "", description: "", price: "", stock: "", image_url: "" }); }}
            style={{ marginLeft: "1rem" }}>
            Cancel
          </button>
        )}
      </form>

      <h3>All Products</h3>
      {products.map((product) => (
        <div key={product.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
          <h4>{product.name}</h4>
          <p>Price: ${product.price} | Stock: {product.stock}</p>
          <button onClick={() => handleEdit(product)}>Edit</button>
          <button onClick={() => handleDelete(product.id)} style={{ marginLeft: "1rem", color: "red" }}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default ManageProducts;