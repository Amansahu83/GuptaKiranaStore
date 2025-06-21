import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import './OrderPage.css';

const OrderPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        
        const { data } = await axios.get(`http://localhost:5000/api/orders/${id}`, config);
        setOrder(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch order details');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, user]);

  return (
    <div className="order-page">
      <Link to="/order-history" className="btn back-button">
        <i className="fas fa-arrow-left"></i> Back to Orders
      </Link>
      
      <h1>Order Details</h1>
      
      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : order ? (
        <div className="order-container">
          <div className="order-info">
            <div className="order-section">
              <h2>Order #{order.id}</h2>
              <p className="order-date">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            <div className="order-section">
              <h3>Shipping</h3>
              <p>{order.shippingAddress}</p>
              <p className="status">
                Status: <span className={`status-badge status-${order.status}`}>{order.status}</span>
              </p>
            </div>
            
            <div className="order-section">
              <h3>Payment</h3>
              <p>Method: {order.paymentMethod}</p>
              <p className="status">
                Status: <span className={`payment-badge payment-${order.paymentStatus}`}>{order.paymentStatus}</span>
              </p>
            </div>
            
            <div className="order-items">
              <h3>Order Items</h3>
              
              {order.OrderItems && order.OrderItems.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="item-image">
                    <img
                      src={item.Product?.imageUrl || 'https://via.placeholder.com/50'}
                      alt={item.Product?.name}
                    />
                  </div>
                  
                  <div className="item-details">
                    <Link to={`/product/${item.productId}`} className="item-name">
                      {item.Product?.name}
                    </Link>
                    <p className="item-price">
                      {item.quantity} x ₹{Number(item.price).toFixed(2)} = ₹{(item.quantity * Number(item.price)).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="order-summary">
            <h3>Order Summary</h3>
            
            <div className="summary-item">
              <span>Items:</span>
              <span>₹{order.OrderItems?.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0).toFixed(2)}</span>
            </div>
            
            <div className="summary-item">
              <span>Shipping:</span>
              <span>₹{(Number(order.totalAmount) - order.OrderItems?.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0)).toFixed(2)}</span>
            </div>
            
            <div className="summary-item total">
              <span>Total:</span>
              <span>₹{Number(order.totalAmount).toFixed(2)}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="error">Order not found</div>
      )}
    </div>
  );
};

export default OrderPage;