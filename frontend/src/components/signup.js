import React, { useState } from "react";
import axios from "axios";
import { 
  ShoppingBag, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Briefcase, 
  CheckCircle, 
  AlertCircle, 
  Package, 
  Truck, 
  Shield, 
  Star 
} from "lucide-react";


const Signup_user = () => {
  const [sign, setsign] = useState({
    full_name: "",
    email: "",
    password_hash: "",
    phone: "",
    role: ""
  });

  const [message, setmessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handlechange = (e) => {
    const { name, value } = e.target;
    setsign((prev) => ({...prev,[name]: value}));
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/signup_user", sign);
      setmessage(res.data.message || "Signup successful!");
      setIsSuccess(true);
      
      setTimeout(() => {
        setsign({
          full_name: "",
          email: "",
          password_hash: "",
          phone: "",
          role: ""
        });
        setmessage("");
      }, 3000);
    } catch (error) {
      setmessage(error.response?.data?.message || "Something went wrong!");
      setIsSuccess(false);
    }
  };

  return (
    <div className="signup-container">
      {/* Animated Background Elements */}
      <div className="background-overlay">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">
              <ShoppingBag className="icon" />
            </div>
            <span className="logo-text">ShopHub</span>
          </div>
          <nav className="nav-menu">
            <a href="#" className="nav-link">Home</a>
            <a href="#" className="nav-link">Products</a>
            <a href="#" className="nav-link">About</a>
            <a href="#" className="nav-link">Contact</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        {/* Left Side - Form */}
        <div className="form-section">
          <div className="form-card">
            <div className="form-header">
              <div className="form-icon">
                <User className="icon" />
              </div>
              <h1 className="form-title">Create Account</h1>
              <p className="form-subtitle">Start shopping with us today</p>
            </div>

            <form onSubmit={handlesubmit} className="form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-wrapper">
                  <User className="input-icon" />
                  <input
                    type="text"
                    name="full_name"
                    value={sign.full_name}
                    onChange={handlechange}
                    placeholder="John Doe"
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    value={sign.email}
                    onChange={handlechange}
                    placeholder="john@example.com"
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" />
                  <input
                    type="password"
                    name="password_hash"
                    value={sign.password_hash}
                    onChange={handlechange}
                    placeholder="••••••••"
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div className="input-wrapper">
                  <Phone className="input-icon" />
                  <input
                    type="tel"
                    name="phone"
                    value={sign.phone}
                    onChange={handlechange}
                    placeholder="+1 (555) 000-0000"
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Account Type</label>
                <div className="input-wrapper">
                  <Briefcase className="input-icon" />
                  <select
                    name="role"
                    value={sign.role}
                    onChange={handlechange}
                    required
                    className="form-input"
                  >
                    <option value="">Select your role</option>
                    <option value="buyer">buyer</option>
                    <option value="seller">seller</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="submit-btn">
                Create Account
              </button>
            </form>

            {message && (
              <div className={`message ${isSuccess ? 'success' : 'error'}`}>
                {isSuccess ? (
                  <CheckCircle className="message-icon" />
                ) : (
                  <AlertCircle className="message-icon" />
                )}
                <p className="message-text">{message}</p>
              </div>
            )}

            <p className="signin-text">
              Already have an account?{" "}
              <a href="/login" className="signin-link">Sign in</a>
            </p>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="content-section">
          <div className="content-wrapper">
            {/* Main Headline */}
            <div className="headline-section">
              <h2 className="headline">
                Your Shopping Paradise
                <span className="headline-gradient">Awaits You</span>
              </h2>
              <p className="headline-subtitle">
                Join thousands of happy customers and discover exclusive deals on premium products
              </p>
            </div>

            {/* Product Cards */}
            <div className="visual-section">
              <div className="product-grid">
                <div className="product-card">
                  <div className="product-image product-image-1">
                    <Package className="product-icon" />
                  </div>
                  <div className="product-details">
                    <div className="product-line product-line-1"></div>
                    <div className="product-line product-line-2"></div>
                    <div className="product-rating">
                      <Star className="star filled" />
                      <Star className="star filled" />
                      <Star className="star filled" />
                      <Star className="star filled" />
                      <Star className="star filled" />
                    </div>
                  </div>
                </div>

                <div className="product-card">
                  <div className="product-image product-image-2">
                    <ShoppingBag className="product-icon" />
                  </div>
                  <div className="product-details">
                    <div className="product-line product-line-1"></div>
                    <div className="product-line product-line-2"></div>
                    <div className="product-rating">
                      <Star className="star filled" />
                      <Star className="star filled" />
                      <Star className="star filled" />
                      <Star className="star filled" />
                      <Star className="star" />
                    </div>
                  </div>
                </div>

                <div className="product-card">
                  <div className="product-image product-image-3">
                    <Star className="product-icon filled" />
                  </div>
                  <div className="product-details">
                    <div className="product-line product-line-1"></div>
                    <div className="product-line product-line-2"></div>
                    <div className="product-rating">
                      <Star className="star filled" />
                      <Star className="star filled" />
                      <Star className="star filled" />
                      <Star className="star filled" />
                      <Star className="star filled" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon feature-icon-1">
                  <Shield className="icon" />
                </div>
                <h3 className="feature-title">Secure Payment</h3>
                <p className="feature-text">100% protected transactions</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon feature-icon-2">
                  <Truck className="icon" />
                </div>
                <h3 className="feature-title">Fast Delivery</h3>
                <p className="feature-text">Free shipping over $50</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon feature-icon-3">
                  <Star className="icon filled" />
                </div>
                <h3 className="feature-title">Top Quality</h3>
                <p className="feature-text">Premium products only</p>
              </div>
            </div>

            {/* Stats */}
            <div className="stats-card">
              <div className="stats-grid">
                <div className="stat-item">
                  <p className="stat-number">15K+</p>
                  <p className="stat-label">Happy Customers</p>
                </div>
                <div className="stat-item">
                  <p className="stat-number">50K+</p>
                  <p className="stat-label">Products</p>
                </div>
                <div className="stat-item">
                  <p className="stat-number">99%</p>
                  <p className="stat-label">Satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup_user;