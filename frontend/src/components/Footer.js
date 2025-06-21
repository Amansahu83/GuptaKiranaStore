import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Gupta Kirana Store</h3>
            <p>Your neighborhood grocery store with the best prices and quality products.</p>
          </div>
          
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/cart">Cart</a></li>
              <li><a href="/login">Sign In</a></li>
              <li><a href="/register">Register</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>123 Main Street</p>
            <p>Delhi, India</p>
            <p>Phone: +91 98765 43210</p>
            <p>Email: info@guptakirana.com</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Gupta Kirana Store. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;