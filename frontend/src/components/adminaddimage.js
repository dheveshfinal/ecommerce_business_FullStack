import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";


const AddImage = () => {
  const {user_id}=useParams()
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [editRow, setEditRow] = useState(null);
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/add_image/${user_id}`);
      setProducts(res.data);
      setMessage("");
    } catch (error) {
      console.error("Fetch error:", error);
      setMessage("Failed to load products");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`http://localhost:8000/delete_product/${productId}`);
      alert("Product deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete product");
    }
  };

  const handleEdit = (product) => {
    setEditRow(product.id);
    setEditData({ ...product });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleSave = async (productId) => {
    try {
      await axios.put(`http://localhost:8000/update_product/${productId}`, editData);
      alert("Product updated successfully");
      setEditRow(null);
      fetchData();
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update product");
    }
  };

  const handleCancel = () => {
    setEditRow(null);
    setEditData({});
  };

  const handleImage = (productId) => {
    navigate(`/addnewimage/${productId}/${user_id}`);
  };

  return (
    <div className="product-container">
      <div className="header-section">
        <h2 className="page-title">Product Management</h2>
        <p className="page-subtitle">Manage your product inventory</p>
      </div>

      {message && (
        <div className="error-message">
          <span className="error-icon">⚠</span>
          {message}
        </div>
      )}

      <div className="table-wrapper">
        <table className="product-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Stock Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length > 0 ? (
              products.map((data) => (
                <tr key={data.id} className={editRow === data.id ? "editing-row" : ""}>
                  {editRow === data.id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          name="title"
                          className="edit-input"
                          value={editData.title || ""}
                          onChange={handleChange}
                          placeholder="Product title"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="description"
                          className="edit-input"
                          value={editData.description || ""}
                          onChange={handleChange}
                          placeholder="Description"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="price"
                          className="edit-input"
                          value={editData.price || ""}
                          onChange={handleChange}
                          placeholder="Price"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="stock_quantity"
                          className="edit-input"
                          value={editData.stock_quantity || ""}
                          onChange={handleChange}
                          placeholder="Stock"
                        />
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn btn-save" 
                            onClick={() => handleSave(data.id)}
                          >
                            Save
                          </button>
                          <button 
                            className="btn btn-cancel" 
                            onClick={handleCancel}
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="cell-title">{data.title}</td>
                      <td className="cell-description">{data.description}</td>
                      <td className="cell-price">₹{data.price}</td>
                      <td className="cell-stock">{data.stock_quantity}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn btn-edit" 
                            onClick={() => handleEdit(data)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-delete" 
                            onClick={() => handleDelete(data.id)}
                          >
                            Delete
                          </button>
                          <button 
                            className="btn btn-image" 
                            onClick={() => handleImage(data.id)}
                          >
                            Add Image
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-state">
                  <div className="empty-icon">📦</div>
                  <p>No products found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddImage;