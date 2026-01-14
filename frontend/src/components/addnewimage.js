import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Add_admin_image = () => {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const params = useParams();
  const product_id = params.product_id || params.id || params.productId;
  const seller_id = params.seller_id || params.sellerId;

  useEffect(() => {
    fetchImages();
  }, [product_id]);

  const fetchImages = async () => {
    if (!product_id || isNaN(product_id)) return;
    setLoadingImages(true);
    try {
      const res = await axios.get(
        `http://localhost:8000/product_images/${product_id}`
      );
      setImages(res.data.images || []);
    } catch (err) {
      console.error("Error fetching images:", err);
    } finally {
      setLoadingImages(false);
    }
  };

  const AddingImage = async () => {
    if (!image) {
      setMessage("Please select an image.");
      return;
    }
    if (!product_id || isNaN(product_id)) {
      setMessage("Invalid product ID. Please check the URL.");
      return;
    }

    const formdata = new FormData();
    formdata.append("file", image);
    formdata.append("product_id", String(product_id).trim());
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:8000/adding_images",
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      setMessage(res.data.message);
      setImage(null);
      setPreview(null);
      fetchImages();
    } catch (err) {
      console.error("Full error:", err);
      console.error("Error response:", err.response?.data);
      let errorMsg = "Upload failed: ";
      if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
          errorMsg += err.response.data.detail
            .map(e => `${e.loc?.join(".")} - ${e.msg}`)
            .join(", ");
        } else {
          errorMsg += err.response.data.detail;
        }
      } else {
        errorMsg += err.message;
      }
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (imageId) => {
    if (!window.confirm("Are you sure you want to delete this image?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/delete_image/${imageId}`);
      setMessage("Image deleted successfully!");
      fetchImages();
    } catch (err) {
      console.error("Delete error:", err);
      setMessage("Failed to delete image: " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="admin-image-container">
      <div className="admin-header">
        <div className="header-content">
          <h1 className="admin-title">Product Image Management</h1>
          <p className="admin-subtitle">Manage images for Product ID: {product_id}</p>
          {seller_id && <p className="seller-info">Seller ID: {seller_id}</p>}
        </div>
      </div>

      <div className="admin-content">
        <div className="upload-section">
          <div className="upload-card">
            <div className="upload-header">
              <h2 className="section-title">Upload New Image</h2>
              <p className="section-description">Add high-quality images to enhance product visibility</p>
            </div>

            <div className="upload-area">
              <input
                type="file"
                id="image-input"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setImage(file);
                    setPreview(URL.createObjectURL(file));
                  }
                }}
                className="file-input"
                accept="image/*"
              />
              <label htmlFor="image-input" className="upload-label">
                <div className="upload-content">
                  <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    <polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                  <p className="upload-text">Drag and drop your image or click to browse</p>
                  <p className="upload-subtext">Supported formats: JPG, PNG, GIF</p>
                </div>
              </label>
            </div>

            {preview && (
              <div className="preview-container">
                <h3 className="preview-title">Image Preview</h3>
                <div className="preview-wrapper">
                  <img src={preview} alt="Preview" className="preview-image" />
                </div>
              </div>
            )}

            <button
              onClick={AddingImage}
              disabled={loading || !image}
              className={`upload-button ${loading ? "loading" : ""}`}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Uploading...
                </>
              ) : (
                <>
                  <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="12 5 12 19" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    <polyline points="19 12 12 19 5 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                  Upload Image
                </>
              )}
            </button>

            {message && (
              <div className={`message-box ${message.includes("failed") || message.includes("Error") ? "error" : "success"}`}>
                <span className="message-icon">
                  {message.includes("failed") || message.includes("Error") ? "✕" : "✓"}
                </span>
                {message}
              </div>
            )}
          </div>
        </div>

        <div className="gallery-section">
          <div className="gallery-header">
            <h2 className="section-title">Existing Images</h2>
            <span className="image-count">{images.length} images</span>
          </div>

          {loadingImages ? (
            <div className="loading-state">
              <div className="loader"></div>
              <p>Loading images...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="empty-state">
              <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                <polyline points="21 15 16 10 5 21" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <p className="empty-text">No images uploaded yet</p>
              <p className="empty-subtext">Start by uploading your first product image</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {images.map((img) => (
                <div key={img.image_id} className="gallery-item">
                  <div className="image-wrapper">
                    <img
                      src={img.image_url || `http://localhost:8000${img.image_path}`}
                      alt={`Product ${img.image_id}`}
                      className="gallery-image"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/200?text=Image+Not+Found";
                      }}
                    />
                    {img.is_primary && <span className="primary-badge">PRIMARY</span>}
                  </div>
                  <div className="image-info">
                    <p className="image-id">ID: {img.image_id}</p>
                  </div>
                  <button
                    onClick={() => deleteImage(img.image_id)}
                    className="delete-button"
                  >
                    <svg className="delete-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="3 6 5 6 21 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      <line x1="10" y1="11" x2="10" y2="17" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      <line x1="14" y1="11" x2="14" y2="17" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Add_admin_image;