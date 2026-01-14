// components/Header.jsx - UPDATE LOGO UNTUK MOBILE
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { 
  FiSearch, 
  FiShoppingCart, 
  FiUser, 
  FiHeart, 
  FiMenu,
  FiHome,
  FiShoppingBag,
  FiTag,
  FiX,
  FiCompass,
  FiLogIn,
  FiLogOut
} from 'react-icons/fi';
import { GiMountainClimbing, GiCampingTent } from 'react-icons/gi';
import { useCart, useWishlist } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  const { getCartTotalItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, logout, isAdmin } = useAuth();

  const navLinks = [
    { path: '/', label: 'Home', icon: <FiHome /> },
    { path: '/products', label: 'Products', icon: <FiShoppingBag /> },
    { path: '/camping', label: 'Camping', icon: <GiCampingTent /> },
    { path: '/hiking', label: 'Hiking', icon: <GiMountainClimbing /> },
    { path: '/sale', label: 'Sale', icon: <FiTag /> },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    } else {
      navigate('/products');
      setSearchOpen(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    setMobileMenuOpen(false);
  };

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setSearchOpen(false);
  };

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  return (
    <>
      <header className="header">
        <div className="header-container">
          {/* Logo - UPDATE: Hanya tampilkan teks di desktop */}
          <Link to="/" className="logo" aria-label="SkalAdventure Home">
            <div className="logo-icon" aria-hidden="true">
              <span>SA</span>
            </div>
            {/* Teks hanya tampil di desktop */}
            <div className="logo-text-container">
              <div className="logo-text">SkalAdventure</div>
              <div className="logo-tagline">Explore The Wild</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav-links" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                aria-current={isActive(link.path) ? 'page' : undefined}
              >
                <span className="nav-icon" aria-hidden="true">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Controls */}
          <div className="header-right">
            {/* Mobile Search Toggle */}
            <button 
              className="icon-button search-toggle"
              onClick={toggleSearch}
              aria-label={searchOpen ? 'Close search' : 'Open search'}
              aria-expanded={searchOpen}
            >
              {searchOpen ? <FiX /> : <FiSearch />}
            </button>

            {/* Desktop Search */}
            <div className="search-container">
              <div className="search-wrapper">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search gear..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  aria-label="Search products"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="clear-search"
                    onClick={() => {
                      setSearchQuery('');
                      navigate('/products');
                    }}
                    aria-label="Clear search"
                  >
                    <FiX />
                  </button>
                )}
                <button
                  type="button"
                  className="search-submit-btn"
                  onClick={handleSearchSubmit}
                  aria-label="Submit search"
                >
                  <FiSearch />
                </button>
              </div>
            </div>

            {/* Header Icons */}
            <div className="header-icons">
              {user ? (
                <>
                  {/* Profile icon untuk semua user yang login */}
                  <Link 
                    to="/profile" 
                    className="icon-button"
                    aria-label="My profile"
                  >
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="user-avatar"
                        style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <FiUser />
                    )}
                  </Link>
                  
                  {/* Hanya tampilkan wishlist jika BUKAN admin */}
                  {!isAdmin && (
                    <Link 
                      to="/wishlist" 
                      className="icon-button"
                      aria-label="Wishlist"
                    >
                      <FiHeart />
                      {wishlistItems.length > 0 && (
                        <span className="icon-badge">{wishlistItems.length}</span>
                      )}
                    </Link>
                  )}
                  
                  {/* Hanya tampilkan cart jika BUKAN admin */}
                  {!isAdmin && (
                    <Link 
                      to="/cart" 
                      className="icon-button"
                      aria-label="Shopping cart"
                    >
                      <FiShoppingCart />
                      {getCartTotalItems() > 0 && (
                        <span className="icon-badge">{getCartTotalItems()}</span>
                      )}
                    </Link>
                  )}
                </>
              ) : (
                <>
                  {/* TOMBOL LOGIN HANYA UNTUK GUEST (belum login) */}
                  <Link 
                    to="/login" 
                    className="icon-button"
                    aria-label="Login"
                  >
                    <FiLogIn />
                  </Link>
                  
                  {/* Wishlist untuk guest */}
                  <Link 
                    to="/wishlist" 
                    className="icon-button"
                    aria-label="Wishlist"
                  >
                    <FiHeart />
                    {wishlistItems.length > 0 && (
                      <span className="icon-badge">{wishlistItems.length}</span>
                    )}
                  </Link>
                  
                  {/* Cart untuk guest */}
                  <Link 
                    to="/cart" 
                    className="icon-button"
                    aria-label="Shopping cart"
                  >
                    <FiShoppingCart />
                    {getCartTotalItems() > 0 && (
                      <span className="icon-badge">{getCartTotalItems()}</span>
                    )}
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-button"
              onClick={toggleMenu}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-drawer"
            >
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div className="mobile-search">
            <div className="mobile-search-wrapper">
              <FiSearch className="mobile-search-icon" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="What are you looking for?"
                className="mobile-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                aria-label="Search products"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-mobile-search"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <FiX />
                </button>
              )}
              <button
                type="button"
                className="mobile-search-submit"
                onClick={handleSearchSubmit}
                aria-label="Submit search"
              >
                Search
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Drawer */}
      <div 
        className={`drawer-overlay ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      <div 
        className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile menu"
      >
        <div className="drawer-header">
          <div className="logo">
            <div className="logo-icon" aria-hidden="true">
              <span>SA</span>
            </div>
            {/* Di mobile drawer juga hanya logo */}
            <div className="logo-text-container">
              <div className="logo-text">SkalAdventure</div>
            </div>
          </div>
          <button 
            className="drawer-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <FiX />
          </button>
        </div>

        <div className="drawer-content">
          {/* Quick Search in Drawer */}
          <div className="drawer-search">
            <div className="drawer-search-wrapper">
              <input
                type="text"
                placeholder="Search adventure gear..."
                className="drawer-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                aria-label="Search products"
              />
              <button
                type="button"
                className="drawer-search-btn"
                onClick={handleSearchSubmit}
              >
                <FiSearch />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="drawer-nav" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`drawer-nav-link ${isActive(link.path) ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={isActive(link.path) ? 'page' : undefined}
              >
                <span className="drawer-nav-icon" aria-hidden="true">
                  {link.icon}
                </span>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Account Links */}
          <div className="drawer-account">
            <h3 className="drawer-section-title">Account</h3>
            <div className="drawer-account-links">
              {user ? (
                <>
                  <Link to="/profile" className="drawer-nav-link" onClick={() => setMobileMenuOpen(false)}>
                    <FiUser /> My Profile
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="drawer-nav-link" onClick={() => setMobileMenuOpen(false)}>
                      👑 Admin Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout} className="drawer-nav-link">
                    <FiLogOut /> Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="drawer-nav-link" onClick={() => setMobileMenuOpen(false)}>
                  <FiLogIn /> Login / Register
                </Link>
              )}
              <Link to="/wishlist" className="drawer-nav-link" onClick={() => setMobileMenuOpen(false)}>
                <FiHeart /> Wishlist {wishlistItems.length > 0 && `(${wishlistItems.length})`}
              </Link>
              <Link to="/cart" className="drawer-nav-link" onClick={() => setMobileMenuOpen(false)}>
                <FiShoppingCart /> Cart {getCartTotalItems() > 0 && `(${getCartTotalItems()})`}
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="drawer-actions">
            <Link 
              to="/products" 
              className="btn btn-primary btn-full"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiCompass /> Browse All Gear
            </Link>
            <Link 
              to="/sale" 
              className="btn btn-outline btn-full"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiTag /> View Sale Items
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;