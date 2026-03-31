import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Alert, PageHeader } from '../components';
import api from '../services/api';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('easyxpense_token', response.data.token);
      
      // Fetch user data and update parent state
      const userResponse = await api.get('/auth/me');
      if (onLogin) {
        onLogin(userResponse.data);
      }
      
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader 
        title="Welcome Back" 
        description="Sign in to your EasyXpense account"
      />
      
      <Card>
        <h2 className="card-title">Login</h2>
        <form onSubmit={handleSubmit} className="form">
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            error={error && error.includes('email') ? error : ''}
          />
          <Input
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            error={error && error.includes('password') ? error : ''}
          />
          {error && !error.includes('email') && !error.includes('password') && (
            <Alert variant="error">{error}</Alert>
          )}
          <Button type="submit" variant="primary" loading={loading} fullWidth>
            {loading ? 'Signing In...' : 'Login'}
          </Button>
          <p className="form-footer">
            Don't have an account? <a href="/signup" className="link">Sign up</a>
          </p>
        </form>
      </Card>
    </>
  );
};

export default Login;
