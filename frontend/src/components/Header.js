import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { CartContext } from '../context/CartContext';
import './Header.css';

const Header = () => {
  const { user, setUser } = useContext(UserContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const logoutHandler = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>Gupta Kirana Store</h1>
          </Link>
          
          <nav className="nav">
            <ul className="nav-links">
              <li>
                <Link to="/cart" className="cart-link">
                  <i className="fas fa-shopping-cart"></i> Cart
                  {cart.length > 0 && (
                    <span className="cart-badge">{cart.reduce((acc, item) => acc + item.qty, 0)}</span>
                  )}
                </Link>
              </li>
              
              {user ? (
                <li className="dropdown">
                  <button className="dropdown-btn">
                    {user.name} <i className="fas fa-caret-down"></i>
                  </button>
                  <div className="dropdown-content">
                    <Link to="/profile">Profile</Link>
                    <Link to="/order-history">Orders</Link>
                    {user.role === 'admin' && (
                      <>
                        <Link to="/admin/products">Products</Link>
                        <Link to="/admin/orders">Orders</Link>
                      </>
                    )}
                    <button onClick={logoutHandler} className="logout-btn">
                      Logout
                    </button>
                  </div>
                </li>
              ) : (
                <li>
                  <Link to="/login">Sign In</Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;