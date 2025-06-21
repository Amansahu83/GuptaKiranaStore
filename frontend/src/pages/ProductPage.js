import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import './ProductPage.css';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { cart, setCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (error) {
        setError('Product not found');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
    const existItem = cart.find((x) => x.id === product.id);
    
    if (existItem) {
      setCart(
        cart.map((x) =>
          x.id === product.id ? { ...existItem, qty: existItem.qty + quantity } : x
        )
      );
    } else {
      setCart([...cart, { ...product, qty: quantity }]);
    }
  };
  
  const buyNowHandler = () => {
    addToCartHandler();
    window.location.href = '/cart';
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="product-page">
      <Link to="/" className="btn back-button">
        <i className="fas fa-arrow-left"></i> Back to Products
      </Link>
      
      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : product ? (
        <div className="product-details">
          <div className="product-image-container">
            <img
              src={product.imageUrl || 'https://via.placeholder.com/500'}
              alt={product.name}
              className="product-image"
            />
          </div>
          
          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-meta">
              <p className="product-category">Category: {product.category}</p>
              <p className={`product-status ${product.isAvailable && product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {product.isAvailable && product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </p>
            </div>
            
            <div className="product-price">₹{product.price}</div>
            
            <div className="product-description">
              <h3>Description:</h3>
              <p>{product.description}</p>
            </div>
            
            {product.isAvailable && product.stock > 0 && (
              <>
                <div className="product-actions">
                  <div className="quantity-selector">
                    <button onClick={decrementQuantity} className="quantity-btn">-</button>
                    <span className="quantity">{quantity}</span>
                    <button onClick={incrementQuantity} className="quantity-btn">+</button>
                  </div>
                </div>
                
                <div className="button-group">
                  <button
                    onClick={addToCartHandler}
                    className="btn add-to-cart-btn"
                    disabled={product.stock === 0}
                  >
                    Add to Cart
                  </button>
                  
                  <button
                    onClick={buyNowHandler}
                    className="btn btn-buy-now"
                    disabled={product.stock === 0}
                  >
                    Buy Now
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="error">Product not found</div>
      )}
    </div>
  );
};

export default ProductPage;