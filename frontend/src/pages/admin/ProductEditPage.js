import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import './AdminPages.css';

const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState(0);
  const [description, setDescription] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const isNewProduct = id === 'new';

  useEffect(() => {
    if (!isNewProduct) {
      const fetchProduct = async () => {
        try {
          const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
          
          setName(data.name);
          setPrice(data.price);
          setImage(data.imageUrl);
          setCategory(data.category);
          setStock(data.stock);
          setDescription(data.description);
          setIsAvailable(data.isAvailable);
        } catch (error) {
          setError('Failed to fetch product details');
        }
      };
      
      fetchProduct();
    }
  }, [id, isNewProduct]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      };

      // Use a placeholder image URL if upload fails
      const placeholderImageUrl = `https://via.placeholder.com/500?text=${encodeURIComponent(name || 'Product')}`;
      
      try {
        const { data } = await axios.post('http://localhost:5000/api/upload', formData, config);
        setImage(data);
      } catch (uploadError) {
        console.error('Upload failed, using placeholder image', uploadError);
        setImage(placeholderImageUrl);
      }
      
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Generate a placeholder image if none is provided
      const defaultImageUrl = `https://via.placeholder.com/500?text=${encodeURIComponent(name)}`;
      const productImage = image || defaultImageUrl;
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      const productData = {
        name,
        price,
        description,
        imageUrl: productImage,
        category,
        stock,
        isAvailable
      };
      
      if (isNewProduct) {
        await axios.post('http://localhost:5000/api/products', productData, config);
      } else {
        await axios.put(`http://localhost:5000/api/products/${id}`, productData, config);
      }
      
      navigate('/admin/products');
    } catch (error) {
      setError(error.response && error.response.data.message
        ? error.response.data.message
        : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <Link to="/admin/products" className="btn btn-light my-3">
        Go Back
      </Link>
      
      <div className="form-section">
        <h1>{isNewProduct ? 'Create Product' : 'Edit Product'}</h1>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={submitHandler}>
          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  id="price"
                  className="form-control"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <input
                  type="text"
                  id="category"
                  className="form-control"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="stock">Stock</label>
                <input
                  type="number"
                  id="stock"
                  className="form-control"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="form-col">
              <div className="form-group">
                <label htmlFor="image">Image</label>
                <input
                  type="text"
                  id="image"
                  className="form-control"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="imageFile">Upload Image</label>
                <input
                  type="file"
                  id="imageFile"
                  className="form-control"
                  onChange={uploadFileHandler}
                />
                {uploading && <div>Uploading...</div>}
              </div>
              
              {image && (
                <div className="form-group">
                  <img src={image} alt="Product" className="image-preview" />
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="isAvailable">Availability</label>
                <select
                  id="isAvailable"
                  className="form-control"
                  value={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.value === 'true')}
                >
                  <option value="true">Available</option>
                  <option value="false">Not Available</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
            ></textarea>
          </div>
          
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductEditPage;