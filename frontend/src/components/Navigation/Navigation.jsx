import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = ({ user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    { path: '/friends', label: 'Friends', icon: '👥' },
    { path: '/groups', label: 'Groups', icon: '👨‍👩‍👧‍👦' },
    { path: '/expenses', label: 'Expenses', icon: '💰' },
    { path: '/settlement', label: 'Settlements', icon: '🤝' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!user) return null;

  return (
    <>
      {/* Mobile Header */}
      <header className="nav-header">
        <div className="nav-header__content">
          <h1 className="nav-header__title">EasyXpense</h1>
          <button 
            className="nav-header__menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
          >
            <span className={`hamburger ${isMobileMenuOpen ? 'hamburger--open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <nav className={`nav-sidebar ${isMobileMenuOpen ? 'nav-sidebar--open' : ''}`}>
        <div className="nav-sidebar__header">
          <h2 className="nav-sidebar__title">EasyXpense</h2>
          <div className="nav-sidebar__user">
            <div className="nav-sidebar__user-info">
              <span className="nav-sidebar__user-name">{user.name}</span>
              <span className="nav-sidebar__user-email">{user.email}</span>
            </div>
          </div>
        </div>

        <ul className="nav-sidebar__menu">
          {navigationItems.map((item) => (
            <li key={item.path} className="nav-sidebar__menu-item">
              <button
                className={`nav-sidebar__menu-link ${
                  location.pathname === item.path ? 'nav-sidebar__menu-link--active' : ''
                }`}
                onClick={() => handleNavigation(item.path)}
              >
                <span className="nav-sidebar__menu-icon">{item.icon}</span>
                <span className="nav-sidebar__menu-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="nav-sidebar__footer">
          <button 
            className="nav-sidebar__logout"
            onClick={handleLogout}
          >
            <span className="nav-sidebar__menu-icon">🚪</span>
            <span className="nav-sidebar__menu-label">Logout</span>
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="nav-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;