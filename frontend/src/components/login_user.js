import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingBag, 
  Mail, 
  Lock, 
  ArrowRight,
  CheckCircle, 
  AlertCircle,
  ShoppingCart,
  Store,
  TrendingUp,
  Users,
  Zap,
  Gift
} from "lucide-react";

const Login = () => {
  const [login, setLogin] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/login_user", login);
      setMessage("Login successful! Redirecting...");
      setIsSuccess(true);
      
      setTimeout(() => {
        if (res.data.role === "buyer") {
          navigate(`/buyerDash/${res.data.user_id}`);
        } else if (res.data.role === "seller") {
          navigate(`/sellerDash/${res.data.user_id}`);
        } else {
          setMessage("Invalid role or user not found");
          setIsSuccess(false);
        }
      }, 1500);
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Login failed. Please check your credentials.");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Animated Background */}
      <div className="background-animated">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
        <div className="circle circle-4"></div>
      </div>

      {/* Header */}
      <header className="login-header">
        <div className="header-wrapper">
          <div className="brand-logo">
            <div className="brand-icon">
              <ShoppingBag className="icon" />
            </div>
            <span className="brand-name">ShopHub</span>
          </div>
          <nav className="header-nav">
            <a href="#" className="nav-item">Home</a>
            <a href="#" className="nav-item">Products</a>
            <a href="#" className="nav-item">About</a>
            <a href="#" className="nav-item">Contact</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="login-main">
        {/* Right Side - Form */}
        <div className="login-form-section">
          <div className="login-card">
            <div className="login-card-header">
              <div className="login-icon-wrapper">
                <Lock className="icon" />
              </div>
              <h1 className="login-title">Welcome Back</h1>
              <p className="login-subtitle">Sign in to continue shopping</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-group">
                <label className="input-label">Email Address</label>
                <div className="input-container">
                  <Mail className="field-icon" />
                  <input
                    type="email"
                    name="email"
                    value={login.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    className="input-field"
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Password</label>
                <div className="input-container">
                  <Lock className="field-icon" />
                  <input
                    type="password"
                    name="password"
                    value={login.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="input-field"
                  />
                </div>
              </div>

              <div className="form-footer">
                <a href="#" className="forgot-link">Forgot Password?</a>
              </div>

              <button 
                type="submit" 
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span>Logging in...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="button-icon" />
                  </>
                )}
              </button>
            </form>

            {message && (
              <div className={`alert-message ${isSuccess ? 'alert-success' : 'alert-error'}`}>
                {isSuccess ? (
                  <CheckCircle className="alert-icon" />
                ) : (
                  <AlertCircle className="alert-icon" />
                )}
                <p className="alert-text">{message}</p>
              </div>
            )}

            <p className="signup-prompt">
              Don't have an account?{" "}
              <a href="/" className="signup-link">Create Account</a>
            </p>
          </div>
        </div>

        {/* Left Side - Content */}
        <div className="login-content-section">
          <div className="content-container">
            {/* Hero Content */}
            <div className="hero-content">
              <h2 className="hero-title">
                Welcome to Your
                <span className="hero-gradient">Shopping Hub</span>
              </h2>
              <p className="hero-description">
                Access your personalized dashboard and explore exclusive deals tailored just for you
              </p>
            </div>

            {/* Feature Showcase */}
            <div className="feature-showcase">
              <div className="showcase-card showcase-primary">
                <div className="showcase-header">
                  <ShoppingCart className="showcase-icon" />
                  <h3 className="showcase-title">For Buyers</h3>
                </div>
                <ul className="showcase-list">
                  <li className="showcase-item">
                    <CheckCircle className="list-icon" />
                    <span>Browse thousands of products</span>
                  </li>
                  <li className="showcase-item">
                    <CheckCircle className="list-icon" />
                    <span>Track your orders in real-time</span>
                  </li>
                  <li className="showcase-item">
                    <CheckCircle className="list-icon" />
                    <span>Save favorites & wishlists</span>
                  </li>
                </ul>
              </div>

              <div className="showcase-card showcase-secondary">
                <div className="showcase-header">
                  <Store className="showcase-icon" />
                  <h3 className="showcase-title">For Sellers</h3>
                </div>
                <ul className="showcase-list">
                  <li className="showcase-item">
                    <CheckCircle className="list-icon" />
                    <span>Manage your inventory</span>
                  </li>
                  <li className="showcase-item">
                    <CheckCircle className="list-icon" />
                    <span>Analytics & insights</span>
                  </li>
                  <li className="showcase-item">
                    <CheckCircle className="list-icon" />
                    <span>Grow your business</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="benefits-grid">
              <div className="benefit-item">
                <div className="benefit-icon benefit-icon-1">
                  <Zap className="icon" />
                </div>
                <div className="benefit-content">
                  <h4 className="benefit-title">Lightning Fast</h4>
                  <p className="benefit-text">Quick checkout process</p>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon benefit-icon-2">
                  <Users className="icon" />
                </div>
                <div className="benefit-content">
                  <h4 className="benefit-title">Trusted Community</h4>
                  <p className="benefit-text">Join 50K+ active users</p>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon benefit-icon-3">
                  <Gift className="icon" />
                </div>
                <div className="benefit-content">
                  <h4 className="benefit-title">Exclusive Deals</h4>
                  <p className="benefit-text">Member-only offers</p>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon benefit-icon-4">
                  <TrendingUp className="icon" />
                </div>
                <div className="benefit-content">
                  <h4 className="benefit-title">Track & Grow</h4>
                  <p className="benefit-text">Real-time analytics</p>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="quote-icon">"</div>
                <p className="testimonial-text">
                  ShopHub has completely transformed my online shopping experience. The platform is intuitive and the deals are amazing!
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">M</div>
                  <div className="author-info">
                    <p className="author-name">Michael Chen</p>
                    <p className="author-role">Premium Member</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;