import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Payment = () => {
  const { userId } = useParams();
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [newAddress, setNewAddress] = useState({
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  });
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchCart(userId);
    fetchAddresses(userId);
  }, [userId]);

  const fetchCart = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:8000/addcart/${userId}`);
      setCartItems(res.data.cart || []);
    } catch (err) {
      setMessage(err.response?.data?.detail || "Error fetching cart");
    }
  };

  const fetchAddresses = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:8000/address/${userId}`);
      const addresses = res.data.addresses || [];
      setAddresses(addresses);
      const defaultAddress = addresses.find((a) => a.is_default);
      if (defaultAddress) setSelectedAddressId(defaultAddress.address_id);
    } catch (err) {
      setMessage(err.response?.data?.detail || "Error fetching address");
    }
  };

  const handleDelete = async (cartId) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      try {
        const res = await axios.delete(`http://localhost:8000/addcart/${cartId}`);
        alert(res.data.message);
        fetchCart(userId);
      } catch (err) {
        alert(err.response?.data?.detail || "Error deleting item");
      }
    }
  };

  const handleQuantityChange = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await axios.put(`http://localhost:8000/addcart/${cartId}`, null, {
        params: { quantity: newQuantity },
      });
      fetchCart(userId);
    } catch (err) {
      alert(err.response?.data?.detail || "Error updating quantity");
    }
  };

  const handleAddAddress = async () => {
    const { address_line1, city, state, postal_code, country } = newAddress;
    if (!address_line1 || !city || !state || !postal_code || !country) {
      alert("Please fill all required address fields");
      return;
    }

    try {
      const res = await axios.post(`http://localhost:8000/address/${userId}`, newAddress);
      alert(res.data.message || "Address added successfully");
      setNewAddress({
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
      });
      fetchAddresses(userId);
    } catch (err) {
      alert(err.response?.data?.detail || "Error adding address");
    }
  };

  const handleCheckout = () => {
    if (!selectedAddressId) {
      alert("Please select or add an address before payment.");
      return;
    }
    if (isProcessing) return;

    setIsProcessing(true);
    const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const options = {
      key: "rzp_test_yourKeyHere",
      amount: totalAmount * 100,
      currency: "INR",
      name: "Quahog Store",
      description: `Payment for ${cartItems.length} item${cartItems.length > 1 ? "s" : ""}`,
      handler: function (response) {
        setIsProcessing(false);
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name: "Dhevesh",
        email: "dhevesh@example.com",
        contact: "9999999999",
      },
      notes: { address_id: selectedAddressId },
      theme: { color: "#007bff" },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function () {
      setIsProcessing(false);
      alert("Payment failed. Please try again.");
    });
    rzp.open();
  };

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="payment-page">
      <h1 className="page-title">🛒 Shopping Cart</h1>
      <p className="item-count">{totalItems} {totalItems === 1 ? "item" : "items"} in your cart</p>

      {message && <div className="alert-message">{message}</div>}

      {cartItems.length > 0 ? (
        <div className="cart-container">
          {/* Product Section */}
          <div className="cart-products">
            {cartItems.map((item) => (
              <div key={item.cart_id} className="product-card">
                <img src={`http://localhost:8000${item.image_url}`} alt={item.title} className="product-img" />
                <div className="product-info">
                  <h2>{item.title}</h2>
                  <p className="desc">{item.description}</p>
                  <p className="price">₹{item.price.toLocaleString("en-IN")}</p>

                  <div className="quantity">
                    <button onClick={() => handleQuantityChange(item.cart_id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.cart_id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <div className="product-actions">
                  <p>Subtotal: ₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                  <button className="btn-remove" onClick={() => handleDelete(item.cart_id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          {/* Address Section */}
          <div className="address-section">
            <h2>🏠 Delivery Address</h2>
            {addresses.length > 0 && (
              <div className="address-list">
                {addresses.map((addr) => (
                  <label key={addr.address_id} className="address-card">
                    <input
                      type="radio"
                      name="address"
                      value={addr.address_id}
                      checked={selectedAddressId === addr.address_id}
                      onChange={() => setSelectedAddressId(addr.address_id)}
                    />
                    <div>
                      <p><strong>{addr.address_line1}</strong></p>
                      {addr.address_line2 && <p>{addr.address_line2}</p>}
                      <p>{addr.city}, {addr.state} - {addr.postal_code}</p>
                      <p>{addr.country}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            <div className="new-address-form">
              <h3>Add New Address</h3>
              <div className="form-grid">
                {Object.keys(newAddress).map((key) => (
                  <input
                    key={key}
                    type="text"
                    placeholder={key.replace(/_/g, " ").toUpperCase()}
                    value={newAddress[key]}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, [key]: e.target.value })
                    }
                  />
                ))}
              </div>
              <button className="btn-primary" onClick={handleAddAddress}>
                ➕ Save Address
              </button>
            </div>
          </div>

          {/* Summary Section */}
          <div className="summary-section">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal ({totalItems} items)</span>
              <span>₹{totalAmount.toLocaleString("en-IN")}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="text-success">FREE</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>₹{totalAmount.toLocaleString("en-IN")}</span>
            </div>
            <button
              className="btn-checkout"
              onClick={handleCheckout}
              disabled={!selectedAddressId || isProcessing}
            >
              {isProcessing ? "Processing..." : "Proceed to Pay"}
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <button className="btn-primary" onClick={() => window.history.back()}>
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default Payment;
