import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { cart, setCart } = useContext(CartContext);

  const addToCartHandler = () => {
    const existItem = cart.find((x) => x.id === product.id);
    
    if (existItem) {
      setCart(
        cart.map((x) =>
          x.id === product.id ? { ...existItem, qty: existItem.qty + 1 } : x
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const buyNowHandler = () => {
    addToCartHandler();
    window.location.href = '/cart';
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}>
        <div className="product-image">
          <img 
            src={product.imageUrl || 'https://via.placeholder.com/300'} 
            alt={product.name} 
          />
        </div>
        <div className="product-info">
          <h3>{product.name}</h3>
          <p className="product-price">₹{product.price}</p>
        </div>
      </Link>
      <div className="product-card-buttons">
        <button 
          className="btn add-to-cart-btn" 
          onClick={addToCartHandler}
          disabled={!product.isAvailable || product.stock <= 0}
        >
          {!product.isAvailable || product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
        {product.isAvailable && product.stock > 0 && (
          <button 
            className="btn btn-buy-now" 
            onClick={buyNowHandler}
          >
            Buy Now
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;