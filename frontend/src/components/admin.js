import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const AdminDash = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const { user_id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: "",
    stock_quantity: "",
    quality_grade: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8000/categories");
        setCategories(res.data.categories);
      } catch (error) {
        console.error(error);
        setMessage("Failed to load categories");
        setMessageType("error");
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8000/product_details", {
        ...product,
        category_id: selectedCategory,
        user_id: user_id,
      });
      

      const productId = res.data.product_id;

      setMessage("Product added successfully!");
      setMessageType("success");

      
      navigate(`/addimage/${user_id}/${productId}`);
    

      setProduct({
        title: "",
        description: "",
        price: "",
        stock_quantity: "",
        quality_grade: "",
      });
      setSelectedCategory("");

      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
    } catch (error) {
      console.error(error);
      setMessage("Failed to add product. Please try again.");
      setMessageType("error");

      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
    }
    
  };


  return (
    <div className="admin-dash-container">
      <div className="admin-dash-header">
        <div className="admin-dash-header-content">
          <h1 className="admin-dash-title">Admin Dashboard</h1>
          <p className="admin-dash-subtitle">Add new products to your inventory</p>
        <a href={`/addimage/${user_id}`}>Admin details</a>
        </div>
      </div>

      <div className="admin-dash-content">
        <div className="admin-dash-card">
          <div className="admin-dash-card-header">
            <h2 className="admin-dash-card-title">Add New Product</h2>
          </div>

          <form onSubmit={handleSubmit} className="admin-dash-form">
            {/* Category Selection */}
            <div className="admin-dash-form-group">
              <label className="admin-dash-label">
                Category <span className="admin-dash-required">*</span>
              </label>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="admin-dash-select"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Details */}
            <div className="admin-dash-grid">
              <div className="admin-dash-form-group">
                <label className="admin-dash-label">
                  Product Title <span className="admin-dash-required">*</span>
                </label>
                
                <input
                  type="text"
                  name="title"
                  placeholder="Enter product title"
                  value={product.title}
                  onChange={handleChange}
                  className="admin-dash-input"
                  required
                />
              </div>

              <div className="admin-dash-form-group">
                <label className="admin-dash-label">
                  Price <span className="admin-dash-required">*</span>
                </label>
                
                <input
                  type="number"
                  name="price"
                  placeholder="0.00"
                  value={product.price}
                  onChange={handleChange}
                  className="admin-dash-input"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="admin-dash-form-group">
                <label className="admin-dash-label">
                  Stock Quantity <span className="admin-dash-required">*</span>
                </label>
                <input
                  type="number"
                  name="stock_quantity"
                  placeholder="0"
                  value={product.stock_quantity}
                  onChange={handleChange}
                  className="admin-dash-input"
                  min="0"
                  required
                />
              </div>

              <div className="admin-dash-form-group">
                <label className="admin-dash-label">
                  Quality Grade <span className="admin-dash-required">*</span>
                </label>
                <input
                  type="text"
                  name="quality_grade"
                  placeholder="A, B, C, D"
                  value={product.quality_grade}
                  onChange={handleChange}
                  className="admin-dash-input"
                  maxLength="1"
                  required
                />
              </div>
            </div>

            <div className="admin-dash-form-group admin-dash-full-width">
              <label className="admin-dash-label">
                Description <span className="admin-dash-required">*</span>
              </label>
              <textarea
                name="description"
                placeholder="Enter product description"
                value={product.description}
                onChange={handleChange}
                className="admin-dash-textarea"
                rows="4"
                required
              />
            </div>

            <div className="admin-dash-button-wrapper">
              <button type="submit" className="admin-dash-submit-btn">
                <svg
                  className="admin-dash-btn-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Save Product
              </button>
            </div>
          </form>

          {message && (
            <div className={`admin-dash-message admin-dash-message-${messageType}`}>
              <span>{message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDash;
