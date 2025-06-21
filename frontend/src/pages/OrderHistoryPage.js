import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import './OrderHistoryPage.css';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        
        const { data } = await axios.get('http://localhost:5000/api/orders/myorders', config);
        setOrders(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch orders');
        setLoading(false);
      }
    };

    if (user && user.token) {
      fetchOrders();
    }
  }, [user]);

  return (
    <div className="order-history-page">
      <h1>Order History</h1>
      
      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : orders.length === 0 ? (
        <div className="no-orders">
          <p>You have no orders yet.</p>
          <Link to="/" className="btn">Go Shopping</Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>STATUS</th>
                <th>PAYMENT</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>₹{order.totalAmount}</td>
                  <td>
                    <span className={`status-badge status-${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <span className={`payment-badge payment-${order.paymentStatus}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <Link to={`/order/${order.id}`} className="btn-sm">
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;