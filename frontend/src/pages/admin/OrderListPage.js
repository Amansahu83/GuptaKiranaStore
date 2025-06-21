import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import './AdminPages.css';

const OrderListPage = () => {
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
        
        const { data } = await axios.get('http://localhost:5000/api/orders', config);
        setOrders(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const updateOrderStatus = async (id, status) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      await axios.put(`http://localhost:5000/api/orders/${id}/status`, { status }, config);
      
      // Update order status in the UI
      setOrders(
        orders.map((order) =>
          order.id === id ? { ...order, status } : order
        )
      );
    } catch (error) {
      setError('Failed to update order status');
    }
  };

  const updatePaymentStatus = async (id, paymentStatus) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      await axios.put(`http://localhost:5000/api/orders/${id}/pay`, { paymentStatus }, config);
      
      // Update payment status in the UI
      setOrders(
        orders.map((order) =>
          order.id === id ? { ...order, paymentStatus } : order
        )
      );
    } catch (error) {
      setError('Failed to update payment status');
    }
  };

  return (
    <div className="admin-page">
      <h1>Orders</h1>
      
      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>USER</th>
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
                  <td>{order.User ? order.User.name : 'N/A'}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>₹{order.totalAmount}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="form-control"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <select
                      value={order.paymentStatus}
                      onChange={(e) => updatePaymentStatus(order.id, e.target.value)}
                      className="form-control"
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                    </select>
                  </td>
                  <td>
                    <Link to={`/order/${order.id}`} className="btn-sm">
                      <i className="fas fa-eye"></i> View Details
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

export default OrderListPage;