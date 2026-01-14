import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";


const BuyDash = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [message, setMessage] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();
  const { id: userId } = useParams();

  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop",
      title: "Summer Collection 2024",
      subtitle: "Up to 50% Off on Selected Items",
      cta: "Shop Now"
    },
    {
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
      title: "New Arrivals",
      subtitle: "Discover the Latest Trends",
      cta: "Explore"
    },
    {
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop",
      title: "Premium Quality Products",
      subtitle: "Best Deals of the Season",
      cta: "View Deals"
    }
  ];

  const fetchProducts = async (categoryId = "") => {
    try {
      const url = categoryId
        ? `http://localhost:8000/products?category_id=${categoryId}`
        : `http://localhost:8000/products`;

      const res = await axios.get(url);
      setProducts(res.data.products || []);
      setMessage(res.data.message || "");
    } catch (err) {
      console.error("Error fetching products:", err);
      setMessage("Failed to load products");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8000/categories");
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    fetchProducts(categoryId);
  };

  const handleImageClick = (productId) => {
    navigate(`/payment/${userId}/${productId}`);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = async (e, productId) => {
    e.stopPropagation();

    const confirmAdd = window.confirm("Are you sure you want to add this item to your cart?");
    if (!confirmAdd) return;

    try {
      const res = await axios.post("http://localhost:8000/addcart", null, {
        params: {
          user_id: userId,
          product_id: productId,
          quantity: 1
        },
      });

      setCartCount(prev => prev + 1);
      alert(res.data.message || "Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart. Please try again.");
    }
  };

  return (
    <div className="buydash-wrapper">
      {/* Sticky Checkout Button */}
      <button 
        onClick={() => navigate(`/payment/${userId}`)}
        className="buydash-sticky-checkout"
        aria-label="Proceed to Checkout"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <span>Checkout</span>
      </button>

      {/* Header */}
      <header className="buydash-header">
        <div className="buydash-header-container">
          <div className="buydash-header-content">
            <div className="buydash-header-left">
              <h1 className="buydash-logo">
                <span className="buydash-logo-icon">🛍️</span>
                ShopHub
              </h1>
              <nav className="buydash-nav-menu">
                <a href="#home" className="buydash-nav-link">Home</a>
                <a href="#shop" className="buydash-nav-link">Shop</a>
                <a href="#deals" className="buydash-nav-link">Deals</a>
                <a href="#contact" className="buydash-nav-link">Contact</a>
              </nav>
            </div>

            <div className="buydash-header-right">
              <div className="buydash-search-bar">
                <svg className="buydash-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="buydash-search-input"
                />
              </div>
              <button className="buydash-icon-btn" aria-label="Wishlist">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
              <button 
                className="buydash-icon-btn buydash-cart-btn" 
                onClick={() => navigate(`/payment/${userId}`)}
                aria-label="Shopping Cart"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                {cartCount > 0 && <span className="buydash-cart-badge">{cartCount}</span>}
              </button>
              <button className="buydash-icon-btn" aria-label="User Account">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </button>
              <button 
                className="buydash-mobile-menu-btn"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Menu"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="buydash-mobile-menu-overlay" onClick={() => setIsMenuOpen(false)}>
          <nav className="buydash-mobile-menu" onClick={(e) => e.stopPropagation()}>
            <a href="#home" className="buydash-mobile-nav-link">Home</a>
            <a href="#shop" className="buydash-mobile-nav-link">Shop</a>
            <a href="#deals" className="buydash-mobile-nav-link">Deals</a>
            <a href="#contact" className="buydash-mobile-nav-link">Contact</a>
          </nav>
        </div>
      )}

      {/* Hero Slider */}
      <div className="buydash-hero-slider">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`buydash-hero-slide ${index === currentSlide ? "buydash-slide-active" : ""}`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="buydash-hero-image"
            />
            <div className="buydash-hero-overlay">
              <div className="buydash-hero-content">
                <h2 className="buydash-hero-title">{slide.title}</h2>
                <p className="buydash-hero-subtitle">{slide.subtitle}</p>
                <button className="buydash-hero-cta">{slide.cta}</button>
              </div>
            </div>
          </div>
        ))}

        <button onClick={prevSlide} className="buydash-slider-btn buydash-slider-btn-prev" aria-label="Previous Slide">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button onClick={nextSlide} className="buydash-slider-btn buydash-slider-btn-next" aria-label="Next Slide">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        <div className="buydash-slider-dots">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`buydash-slider-dot ${index === currentSlide ? "buydash-dot-active" : ""}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="buydash-main-content">
        {/* Category Filter */}
        <div className="buydash-filter-section">
          <h2 className="buydash-section-title">
            <span className="buydash-title-accent">Discover</span> Our Products
          </h2>
          <div className="buydash-category-filter">
            <span className="buydash-filter-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
              Filter by Category:
            </span>
            <div className="buydash-category-buttons">
              <button
                onClick={() => handleCategoryChange("")}
                className={`buydash-category-btn ${selectedCategory === "" ? "buydash-category-active" : ""}`}
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.category_id}
                  onClick={() => handleCategoryChange(cat.category_id)}
                  className={`buydash-category-btn ${selectedCategory === cat.category_id ? "buydash-category-active" : ""}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="buydash-products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <div
                key={index}
                className="buydash-product-card"
                onClick={() => handleImageClick(product.product_id)}
              >
                <div className="buydash-product-image-wrapper">
                  {product.images && product.images.length > 0 ? (
                    <div className="buydash-product-image-slider">
                      {product.images.map((img, i) => (
                        <img
                          key={i}
                          src={`http://localhost:8000${img.url}`}
                          alt={product.title}
                          className="buydash-product-image"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="buydash-no-image">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                      <span>No Image Available</span>
                    </div>
                  )}

                  <button className="buydash-wishlist-btn" onClick={(e) => e.stopPropagation()} aria-label="Add to Wishlist">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </button>

                  {product.images && product.images.length > 1 && (
                    <span className="buydash-image-count">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                      {product.images.length}
                    </span>
                  )}
                </div>

                <div className="buydash-product-info">
                  <h3 className="buydash-product-title">{product.title}</h3>
                  <p className="buydash-product-description">{product.description}</p>

                  <div className="buydash-product-footer">
                    <div className="buydash-product-price">
                      <span className="buydash-currency">₹</span>
                      <span className="buydash-price">{product.price}</span>
                    </div>
                    <div className="buydash-product-rating">
                      <svg className="buydash-star-icon" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                      <span className="buydash-rating-text">4.5</span>
                    </div>
                  </div>

                  <div className="buydash-product-quality">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                    Quality: <span className="buydash-quality-grade">{product.quality_grade}</span>
                  </div>

                  <button
                    className="buydash-add-to-cart-btn"
                    onClick={(e) => handleAddToCart(e, product.product_id)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="buydash-no-products">
              <svg className="buydash-no-products-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p className="buydash-no-products-text">No products found</p>
              <p className="buydash-no-products-subtext">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="buydash-footer">
        <div className="buydash-footer-container">
          <div className="buydash-footer-content">
            <div className="buydash-footer-section">
              <h3 className="buydash-footer-title">
                <span className="buydash-logo-icon">🛍️</span>
                ShopHub
              </h3>
              <p className="buydash-footer-text">Your trusted online shopping destination for quality products at great prices.</p>
              <div className="buydash-social-links">
                <a href="#facebook" className="buydash-social-link" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#twitter" className="buydash-social-link" aria-label="Twitter">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
                <a href="#instagram" className="buydash-social-link" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              </div>
            </div>
            <div className="buydash-footer-section">
              <h4 className="buydash-footer-subtitle">Quick Links</h4>
              <ul className="buydash-footer-links">
                <li><a href="#about" className="buydash-footer-link">About Us</a></li>
                <li><a href="#contact" className="buydash-footer-link">Contact</a></li>
                <li><a href="#faq" className="buydash-footer-link">FAQ</a></li>
                <li><a href="#shipping" className="buydash-footer-link">Shipping Info</a></li>
              </ul>
            </div>
            <div className="buydash-footer-section">
              <h4 className="buydash-footer-subtitle">Customer Service</h4>
              <ul className="buydash-footer-links">
                <li><a href="#returns" className="buydash-footer-link">Returns</a></li>
                <li><a href="#terms" className="buydash-footer-link">Terms & Conditions</a></li>
                <li><a href="#privacy" className="buydash-footer-link">Privacy Policy</a></li>
                <li><a href="#support" className="buydash-footer-link">Support</a></li>
              </ul>
            </div>
            <div className="buydash-footer-section">
              <h4 className="buydash-footer-subtitle">Newsletter</h4>
              <p className="buydash-footer-text">Subscribe to get special offers and updates.</p>
              <div className="buydash-newsletter-form">
                <input type="email" placeholder="Your email" className="buydash-newsletter-input" />
                <button className="buydash-newsletter-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="buydash-footer-bottom">
            <p className="buydash-footer-copyright">© 2024 ShopHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BuyDash;