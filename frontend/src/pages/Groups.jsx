import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import api from '../services/api';

const Groups = () => {
  const [groupName, setGroupName] = useState('');
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [memberEmail, setMemberEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('easyxpense_token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchGroups();
  }, [navigate]);

  const fetchGroups = async () => {
    try {
      const response = await api.get('/groups');
      setGroups(response.data);
    } catch (err) {
      console.error('Error fetching groups:', err);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await api.post('/groups', { name: groupName });
      setMessage(response.data.message);
      setGroupName('');
      fetchGroups();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create group');
    }
  };

  const handleViewGroup = async (groupId) => {
    try {
      const response = await api.get(`/groups/${groupId}`);
      setSelectedGroup(response.data);
      setMessage('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load group details');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedGroup) return;

    setMessage('');
    setError('');

    try {
      const response = await api.post(`/groups/${selectedGroup.id}/members`, { email: memberEmail });
      setMessage(response.data.message);
      setMemberEmail('');
      handleViewGroup(selectedGroup.id);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <div className="container">
      <h1 className="title">Groups</h1>

      <button onClick={handleBackHome} className="btn btn-secondary" style={{ marginBottom: '20px' }}>
        Back to Home
      </button>

      {message && <p className="success-text" style={{ marginBottom: '20px' }}>{message}</p>}
      {error && <p className="error-text" style={{ marginBottom: '20px' }}>{error}</p>}

      <Card>
        <h2 className="card-title">Create Group</h2>
        <form onSubmit={handleCreateGroup} className="form">
          <div className="form-group">
            <label className="form-label">Group Name</label>
            <input
              type="text"
              className="form-input"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Goa Trip"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Create Group</button>
        </form>
      </Card>

      <Card>
        <h2 className="card-title">Your Groups ({groups.length})</h2>
        {groups.length === 0 ? (
          <p className="card-text">No groups yet. Create a group to get started!</p>
        ) : (
          <div className="groups-list">
            {groups.map((group) => (
              <div key={group.id} className="group-item">
                <div className="group-info">
                  <p className="group-name">{group.name}</p>
                </div>
                <button
                  onClick={() => handleViewGroup(group.id)}
                  className="btn btn-primary btn-small"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {selectedGroup && (
        <Card>
          <h2 className="card-title">Group: {selectedGroup.name}</h2>
          
          <div className="group-section">
            <h3 className="section-subtitle">Members ({selectedGroup.members.length})</h3>
            <div className="members-list">
              {selectedGroup.members.map((member) => (
                <div key={member.id} className="member-item">
                  <div className="member-info">
                    <p className="member-name">{member.name}</p>
                    <p className="member-email">{member.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="group-section">
            <h3 className="section-subtitle">Add Member</h3>
            <form onSubmit={handleAddMember} className="form">
              <div className="form-group">
                <label className="form-label">Friend's Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  placeholder="friend@email.com"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Add Member</button>
            </form>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Groups;
