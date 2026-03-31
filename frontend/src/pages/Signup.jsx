import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Alert, PageHeader } from '../components';
import api from '../services/api';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/auth/register', { name, email, password });
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader 
        title="Join EasyXpense" 
        description="Create your account and start tracking expenses"
      />
      
      <Card>
        <h2 className="card-title">Sign Up</h2>
        <form onSubmit={handleSubmit} className="form">
          <Input
            type="text"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <Alert variant="error">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Button type="submit" variant="primary" loading={loading} fullWidth>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
          <p className="form-footer">
            Already have an account? <a href="/login" className="link">Login</a>
          </p>
        </form>
      </Card>
    </>
  );
};

export default Signup;
