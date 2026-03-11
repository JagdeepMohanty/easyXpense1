import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import api from '../services/api';

const Friends = () => {
  const [friendEmail, setFriendEmail] = useState('');
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
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

    try {
      const response = await api.post('/friends/request', { email: friendEmail });
      setMessage(response.data.message);
      setFriendEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send request');
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

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <div className="container">
      <h1 className="title">Friends</h1>

      <button onClick={handleBackHome} className="btn btn-secondary" style={{ marginBottom: '20px' }}>
        Back to Home
      </button>

      {message && <p className="success-text" style={{ marginBottom: '20px' }}>{message}</p>}
      {error && <p className="error-text" style={{ marginBottom: '20px' }}>{error}</p>}

      <Card>
        <h2 className="card-title">Add Friend</h2>
        <form onSubmit={handleSendRequest} className="form">
          <div className="form-group">
            <label className="form-label">Friend's Email</label>
            <input
              type="email"
              className="form-input"
              value={friendEmail}
              onChange={(e) => setFriendEmail(e.target.value)}
              placeholder="friend@email.com"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Send Request</button>
        </form>
      </Card>

      {pendingRequests.length > 0 && (
        <Card>
          <h2 className="card-title">Pending Requests ({pendingRequests.length})</h2>
          <div className="friends-list">
            {pendingRequests.map((req) => (
              <div key={req.request_id} className="friend-item">
                <div className="friend-info">
                  <p className="friend-name">{req.name}</p>
                  <p className="friend-email">{req.email}</p>
                </div>
                <button
                  onClick={() => handleAcceptRequest(req.request_id)}
                  className="btn btn-primary btn-small"
                >
                  Accept
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <h2 className="card-title">Your Friends ({friends.length})</h2>
        {friends.length === 0 ? (
          <p className="card-text">No friends yet. Send a friend request to get started!</p>
        ) : (
          <div className="friends-list">
            {friends.map((friend) => (
              <div key={friend.id} className="friend-item">
                <div className="friend-info">
                  <p className="friend-name">{friend.name}</p>
                  <p className="friend-email">{friend.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Friends;
