import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Alert, EmptyState, LoadingSpinner, PageHeader, Breadcrumb, Badge } from '../components';
import api from '../services/api';

const Friends = () => {
  const [friendEmail, setFriendEmail] = useState('');
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('easyxpense_token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchFriends();
    fetchPendingRequests();
  }, [navigate]);

  const fetchFriends = async () => {
    try {
      const response = await api.get('/friends');
      setFriends(response.data);
    } catch (err) {
      console.error('Error fetching friends:', err);
    } finally {
      setPageLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const response = await api.get('/friends/requests/pending');
      setPendingRequests(response.data);
    } catch (err) {
      console.error('Error fetching requests:', err);
    }
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/friends/request', { email: friendEmail });
      setMessage(response.data.message);
      setFriendEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await api.post('/friends/accept', { request_id: requestId });
      setMessage('Friend request accepted!');
      fetchFriends();
      fetchPendingRequests();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept request');
    }
  };

  if (pageLoading) {
    return (
      <>
        <PageHeader 
          title="Friends" 
          description="Manage your friends and send requests"
          breadcrumb={
            <Breadcrumb 
              items={[
                { label: 'Home', path: '/' },
                { label: 'Friends' }
              ]} 
            />
          }
        />
        <Card>
          <LoadingSpinner size="lg" text="Loading your friends..." />
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader 
        title="Friends" 
        description="Manage your friends and send requests"
        breadcrumb={
          <Breadcrumb 
            items={[
              { label: 'Home', path: '/' },
              { label: 'Friends' }
            ]} 
          />
        }
      />

      {message && <Alert variant="success" style={{ marginBottom: '20px' }}>{message}</Alert>}
      {error && <Alert variant="error" style={{ marginBottom: '20px' }}>{error}</Alert>}

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 className="card-title">Add Friend</h2>
          <Badge variant="info" size="sm">{friends.length} Friends</Badge>
        </div>
        <form onSubmit={handleSendRequest} className="form">
          <Input
            type="email"
            label="Friend's Email"
            value={friendEmail}
            onChange={(e) => setFriendEmail(e.target.value)}
            placeholder="friend@email.com"
            required
            helpText="Enter the email address of the person you want to add as a friend"
          />
          <Button type="submit" variant="primary" loading={loading} fullWidth>
            {loading ? 'Sending Request...' : '📧 Send Friend Request'}
          </Button>
        </form>
      </Card>

      {pendingRequests.length > 0 && (
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 className="card-title">Pending Requests</h2>
            <Badge variant="warning" size="sm">{pendingRequests.length} Pending</Badge>
          </div>
          <div className="friends-list">
            {pendingRequests.map((req) => (
              <div key={req.request_id} className="friend-item" style={{ padding: '1rem', backgroundColor: 'var(--color-warning-50)', border: '1px solid var(--color-warning-200)', borderRadius: 'var(--radius-md)', marginBottom: '0.5rem' }}>
                <div className="friend-info">
                  <p className="friend-name" style={{ fontWeight: 'var(--font-weight-semibold)', margin: '0 0 0.25rem 0' }}>{req.name}</p>
                  <p className="friend-email" style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: 'var(--font-size-sm)' }}>{req.email}</p>
                </div>
                <Button
                  onClick={() => handleAcceptRequest(req.request_id)}
                  variant="success"
                  size="sm"
                >
                  ✓ Accept
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 className="card-title">Your Friends</h2>
          <Badge variant="success" size="sm">{friends.length} Connected</Badge>
        </div>
        {friends.length === 0 ? (
          <EmptyState
            icon="👥"
            title="No friends yet"
            description="Start building your network by sending friend requests. Friends can be added to groups and share expenses together."
            action={
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button onClick={() => document.querySelector('input[type="email"]').focus()} variant="primary" size="sm">
                  Add First Friend
                </Button>
                <Button onClick={() => navigate('/groups')} variant="outline" size="sm">
                  Browse Groups
                </Button>
              </div>
            }
          />
        ) : (
          <div className="friends-list">
            {friends.map((friend) => (
              <div key={friend.id} className="friend-item" style={{ padding: '1rem', backgroundColor: 'var(--color-success-50)', border: '1px solid var(--color-success-200)', borderRadius: 'var(--radius-md)', marginBottom: '0.5rem' }}>
                <div className="friend-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <p className="friend-name" style={{ fontWeight: 'var(--font-weight-semibold)', margin: 0 }}>{friend.name}</p>
                    <Badge variant="success" size="sm">✓ Friend</Badge>
                  </div>
                  <p className="friend-email" style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: 'var(--font-size-sm)' }}>{friend.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
};

export default Friends;
