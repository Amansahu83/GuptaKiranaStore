import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import './AdminPages.css';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        
        const { data } = await axios.get('http://localhost:5000/api/products', config);
        setProducts(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        
        await axios.delete(`http://localhost:5000/api/products/${id}`, config);
        
        // Update products list after deletion
        setProducts(products.filter(product => product.id !== id));
      } catch (error) {
        setError('Failed to delete product');
      }
    }
  };

  const createProductHandler = () => {
    navigate('/admin/product/new/edit');
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Products</h1>
        <button className="btn" onClick={createProductHandler}>
          <i className="fas fa-plus"></i> Create Product
        </button>
      </div>
      
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
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>STOCK</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>₹{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.stock}</td>
                  <td>
                    <Link to={`/admin/product/${product.id}/edit`} className="btn-sm" title="Edit">
                      <i className="fas fa-edit"></i> Edit
                    </Link>
                    <button
                      className="btn-sm btn-danger"
                      onClick={() => deleteHandler(product.id)}
                      title="Delete"
                    >
                      <i className="fas fa-trash"></i> Delete
                    </button>
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

export default ProductListPage;