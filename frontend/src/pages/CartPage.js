import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { UserContext } from '../context/UserContext';
import './CartPage.css';

const CartPage = () => {
  const { cart, setCart } = useContext(CartContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [showCheckout, setShowCheckout] = useState(false);
  const [error, setError] = useState('');

  // Calculate prices
  const itemsPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 500 ? 0 : 50;
  const taxPrice = Number((0.05 * itemsPrice).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  const removeFromCartHandler = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const updateCartQuantity = (id, qty) => {
    const item = cart.find((x) => x.id === id);
    
    if (item) {
      // Check if quantity is valid
      if (qty <= 0) {
        removeFromCartHandler(id);
        return;
      }
      
      if (qty > item.stock) {
        return;
      }
      
      setCart(
        cart.map((x) => (x.id === id ? { ...item, qty } : x))
      );
    }
  };

  const checkoutHandler = () => {
    if (!user) {
      navigate('/login');
    } else {
      setShowCheckout(true);
    }
  };

  const placeOrderHandler = async () => {
    if (!shippingAddress) {
      setError('Please enter a shipping address');
      return;
    }
    
    try {
      const orderItems = cart.map(item => ({
        productId: item.id,
        quantity: item.qty
      }));
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      };
      
      const { data } = await axios.post(
        'http://localhost:5000/api/orders',
        {
          orderItems,
          shippingAddress,
          paymentMethod,
          totalAmount: totalPrice
        },
        config
      );
      
      alert('Order placed successfully!');
      setCart([]);
      navigate('/order-history');
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to place order. Please try again.'
      );
    }
  };

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      
      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <Link to="/" className="btn">Go Shopping</Link>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img
                    src={item.imageUrl || 'https://via.placeholder.com/100'}
                    alt={item.name}
                  />
                </div>
                
                <div className="cart-item-details">
                  <Link to={`/product/${item.id}`} className="cart-item-name">
                    {item.name}
                  </Link>
                  <p className="cart-item-price">₹{item.price}</p>
                </div>
                
                <div className="cart-item-quantity">
                  <button
                    onClick={() => updateCartQuantity(item.id, item.qty - 1)}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity">{item.qty}</span>
                  <button
                    onClick={() => updateCartQuantity(item.id, item.qty + 1)}
                    className="quantity-btn"
                    disabled={item.qty >= item.stock}
                  >
                    +
                  </button>
                </div>
                
                <div className="cart-item-subtotal">
                  ₹{(item.price * item.qty).toFixed(2)}
                </div>
                
                <button
                  onClick={() => removeFromCartHandler(item.id)}
                  className="remove-btn"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-item">
              <span>Items:</span>
              <span>₹{itemsPrice.toFixed(2)}</span>
            </div>
            
            <div className="summary-item">
              <span>Shipping:</span>
              <span>₹{shippingPrice.toFixed(2)}</span>
            </div>
            
            <div className="summary-item">
              <span>Tax:</span>
              <span>₹{taxPrice.toFixed(2)}</span>
            </div>
            
            <div className="summary-item total">
              <span>Total:</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            
            {!showCheckout ? (
              <button onClick={checkoutHandler} className="btn checkout-btn">
                Proceed to Checkout
              </button>
            ) : (
              <div className="checkout-form">
                {error && <div className="alert alert-danger">{error}</div>}
                
                <div className="form-group">
                  <label htmlFor="address">Shipping Address</label>
                  <textarea
                    id="address"
                    className="form-control"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    required
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label htmlFor="payment">Payment Method</label>
                  <select
                    id="payment"
                    className="form-control"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="Cash on Delivery">Cash on Delivery</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="UPI">UPI</option>
                  </select>
                </div>
                
                <button onClick={placeOrderHandler} className="btn place-order-btn">
                  Place Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;