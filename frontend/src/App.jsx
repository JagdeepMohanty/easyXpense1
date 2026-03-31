import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Layout } from './components';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Friends from './pages/Friends';
import Groups from './pages/Groups';
import Expenses from './pages/Expenses';
import Settlement from './pages/Settlement';
import api from './services/api';
import './styles.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('easyxpense_token');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data);
        } catch (error) {
          localStorage.removeItem('easyxpense_token');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('easyxpense_token');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="container">
        <h1 className="title">EasyXpense</h1>
        <div className="card">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Home user={user} onLogout={handleLogout} />} />
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/settlement" element={<Settlement />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
