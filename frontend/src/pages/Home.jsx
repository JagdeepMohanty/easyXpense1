import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import api from '../services/api';

const Home = () => {
  const [status, setStatus] = useState('Loading...');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [debts, setDebts] = useState({ you_owe: [], you_are_owed: [] });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await api.get('/health');
        setStatus(response.data.status);
      } catch (error) {
        setStatus('Error connecting to backend');
      }
    };

    const fetchUser = async () => {
      const token = localStorage.getItem('easyxpense_token');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data);
          fetchDebts();
        } catch (error) {
          localStorage.removeItem('easyxpense_token');
        }
      }
      setLoading(false);
    };

    const fetchDebts = async () => {
      try {
        const response = await api.get('/debts');
        setDebts(response.data);
      } catch (error) {
        console.error('Error fetching debts:', error);
      }
    };

    fetchHealth();
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('easyxpense_token');
    setUser(null);
    setDebts({ you_owe: [], you_are_owed: [] });
  };

  if (loading) {
    return (
      <div className="container">
        <h1 className="title">EasyXpense</h1>
        <Card>
          <p className="card-text">Loading...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="title">EasyXpense</h1>
      
      <Card>
        <h2 className="card-title">Backend Status:</h2>
        <p className="card-text">{status}</p>
      </Card>

      {user ? (
        <>
          <Card>
            <h2 className="card-title">Welcome, {user.name}!</h2>
            <p className="card-text">Email: {user.email}</p>
            <div className="button-group">
              <button onClick={() => navigate('/friends')} className="btn btn-primary">Friends</button>
              <button onClick={() => navigate('/groups')} className="btn btn-primary">Groups</button>
              <button onClick={() => navigate('/expenses')} className="btn btn-primary">Expenses</button>
              <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
            </div>
          </Card>

          <Card>
            <h2 className="card-title">Debt Summary</h2>
            
            <div className="debt-section">
              <h3 className="debt-subtitle">You Owe</h3>
              {debts.you_owe.length === 0 ? (
                <p className="debt-empty">You don't owe anyone!</p>
              ) : (
                <>
                  <div className="debt-list">
                    {debts.you_owe.map((debt) => (
                      <div key={debt.user_id} className="debt-item debt-owe">
                        <span className="debt-text">You owe {debt.name}</span>
                        <span className="debt-amount">₹{debt.amount}</span>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => navigate('/settlement')} 
                    className="btn btn-primary" 
                    style={{ marginTop: '16px', width: '100%' }}
                  >
                    Settle Debts
                  </button>
                </>
              )}
            </div>

            <div className="debt-section">
              <h3 className="debt-subtitle">Owed To You</h3>
              {debts.you_are_owed.length === 0 ? (
                <p className="debt-empty">No one owes you!</p>
              ) : (
                <div className="debt-list">
                  {debts.you_are_owed.map((debt) => (
                    <div key={debt.user_id} className="debt-item debt-owed">
                      <span className="debt-text">{debt.name} owes you</span>
                      <span className="debt-amount">₹{debt.amount}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </>
      ) : (
        <Card>
          <h2 className="card-title">Get Started</h2>
          <p className="card-text">Please login or create an account to continue</p>
          <div className="button-group">
            <button onClick={() => navigate('/login')} className="btn btn-primary">Login</button>
            <button onClick={() => navigate('/signup')} className="btn btn-secondary">Sign Up</button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Home;
