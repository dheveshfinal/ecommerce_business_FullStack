## E-Commerce Full Stack Application

A full-stack **E-Commerce Business Application** developed using **React.js** (Frontend), **FastAPI** (Backend), and **PostgreSQL** (Database). The system supports two main roles: **Buyer** and **Seller**, with complete authentication, product management, image handling, cart, and checkout functionality.

* * *

## Tech Stack

### Frontend

*   React.js
    
*   JavaScript (ES6+)
    
*   HTML5
    
*   CSS3
    
*   npm
    

### Backend

*   FastAPI
    
*   Python
    
*   Uvicorn (ASGI Server)
    

### Database

*   PostgreSQL
    

### Image Storage

*   Product images are stored locally in the backend
    

* * *

## User Roles

### Buyer

*   User registration and login
    
*   Browse all available products
    
*   Filter products by category
    
*   Search products
    
*   Add products to cart
    
*   Increase or decrease cart quantity
    
*   View order summary
    
*   Add delivery address
    
*   Checkout
    

### Seller

*   Seller registration and login
    
*   Add new products
    
*   Edit existing products
    
*   Delete products
    
*   Manage stock quantity
    
*   Upload and manage product images
    
*   View and manage product inventory
    

* * *

## Key Features

*   JWT-based authentication
    
*   Role-based access control (Buyer / Seller)
    
*   Product CRUD operations
    
*   Product image upload and management
    
*   Shopping cart functionality
    
*   Checkout and order summary
    
*   Clean and modern user interface
    

* * *

## Image Management

*   Sellers can upload multiple images for a product
    
*   Images are stored in the backend directory:
    

    backend/static/product_images/
    

*   Supported image formats:
    
    *   JPG
        
    *   PNG
        
    *   GIF
        

* * *

## Installation Requirements

*   Node.js
    
*   npm
    
*   Python 3.9+
    
*   PostgreSQL
    

* * *

## Backend Setup

1.  Navigate to the backend directory:
    

    C:\Users\dheve\OneDrive\Desktop\ecommerce\backend
    

2.  (Optional) Create and activate a virtual environment:
    

    python -m venv venv
    venv\Scripts\activate
    

3.  Install backend dependencies:
    

    pip install -r requirements.txt
    

4.  Start the FastAPI server:
    

    uvicorn main:app --reload
    

Backend server runs at:

    http://127.0.0.1:8000
    

* * *

## Frontend Setup

1.  Navigate to the frontend directory:
    

    C:\Users\dheve\OneDrive\Desktop\ecommerce\frontend
    

2.  Install frontend dependencies:
    

    npm install
    

3.  Start the React development server:
    

    npm start
    

Frontend application runs at:

    http://localhost:3000
    

* * *

## API Documentation

FastAPI provides built-in API documentation:

*   Swagger UI:
    

    http://127.0.0.1:8000/docs
    

*   ReDoc:
    

    http://127.0.0.1:8000/redoc
    

* * *

## Screenshots

*   Product listing page
    
*   Shopping cart and checkout page
    
*   Seller product management dashboard
    
*   Product image upload interface
    

* * *

## Future Enhancements

*   Payment gateway integration
    
*   Order history for buyers
    
*   Product ratings and reviews
    
*   Admin dashboard
    
*   Cloud-based image storage
    

* * *

## Author

**Dhevesh Arun**

* * *

## License

This project is created for educational and learning purposes.
