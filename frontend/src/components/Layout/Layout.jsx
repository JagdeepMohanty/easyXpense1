import Navigation from '../Navigation';
import './Layout.css';

const Layout = ({ children, user, onLogout }) => {
  return (
    <div className="layout">
      <Navigation user={user} onLogout={onLogout} />
      <main className={`layout__main ${user ? 'layout__main--with-nav' : ''}`}>
        <div className="layout__content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;