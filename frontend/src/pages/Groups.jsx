import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Alert, EmptyState, LoadingSpinner, PageHeader, Breadcrumb, Badge } from '../components';
import api from '../services/api';

const Groups = () => {
  const [groupName, setGroupName] = useState('');
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [memberEmail, setMemberEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [memberLoading, setMemberLoading] = useState(false);
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
    } finally {
      setPageLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/groups', { name: groupName });
      setMessage(response.data.message);
      setGroupName('');
      fetchGroups();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create group');
    } finally {
      setLoading(false);
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
    setMemberLoading(true);

    try {
      const response = await api.post(`/groups/${selectedGroup.id}/members`, { email: memberEmail });
      setMessage(response.data.message);
      setMemberEmail('');
      handleViewGroup(selectedGroup.id);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member');
    } finally {
      setMemberLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <>
        <PageHeader 
          title="Groups" 
          description="Create and manage your expense groups"
          breadcrumb={
            <Breadcrumb 
              items={[
                { label: 'Home', path: '/' },
                { label: 'Groups' }
              ]} 
            />
          }
        />
        <Card>
          <LoadingSpinner size="lg" text="Loading your groups..." />
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader 
        title="Groups" 
        description="Create and manage your expense groups"
        breadcrumb={
          <Breadcrumb 
            items={[
              { label: 'Home', path: '/' },
              { label: 'Groups' }
            ]} 
          />
        }
      />

      {message && <Alert variant="success" style={{ marginBottom: '20px' }}>{message}</Alert>}
      {error && <Alert variant="error" style={{ marginBottom: '20px' }}>{error}</Alert>}

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 className="card-title">Create Group</h2>
          <Badge variant="info" size="sm">{groups.length} Groups</Badge>
        </div>
        <form onSubmit={handleCreateGroup} className="form">
          <Input
            type="text"
            label="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Goa Trip, Office Lunch, Roommates..."
            required
            helpText="Choose a descriptive name for your expense group"
          />
          <Button type="submit" variant="primary" loading={loading} fullWidth>
            {loading ? 'Creating Group...' : '🎆 Create New Group'}
          </Button>
        </form>
      </Card>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 className="card-title">Your Groups</h2>
          <Badge variant="primary" size="sm">{groups.length} Active</Badge>
        </div>
        {groups.length === 0 ? (
          <EmptyState
            icon="👥"
            title="No groups yet"
            description="Groups help you organize and split expenses with specific people. Create your first group to get started with expense tracking."
            action={
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button onClick={() => document.querySelector('input[placeholder*="Goa"]').focus()} variant="primary" size="sm">
                  Create First Group
                </Button>
                <Button onClick={() => navigate('/friends')} variant="outline" size="sm">
                  Add Friends First
                </Button>
              </div>
            }
          />
        ) : (
          <div className="groups-list">
            {groups.map((group) => (
              <div key={group.id} className="group-item" style={{ padding: '1rem', backgroundColor: 'var(--color-primary-50)', border: '1px solid var(--color-primary-200)', borderRadius: 'var(--radius-md)', marginBottom: '0.5rem' }}>
                <div className="group-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <p className="group-name" style={{ fontWeight: 'var(--font-weight-semibold)', margin: 0 }}>{group.name}</p>
                    <Badge variant="primary" size="sm">👥 Group</Badge>
                  </div>
                  <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: 'var(--font-size-sm)' }}>Click to view members and add expenses</p>
                </div>
                <Button
                  onClick={() => handleViewGroup(group.id)}
                  variant="primary"
                  size="sm"
                >
                  👁️ View Details
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {selectedGroup && (
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 className="card-title">Group: {selectedGroup.name}</h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Badge variant="success" size="sm">{selectedGroup.members.length} Members</Badge>
              <Button onClick={() => setSelectedGroup(null)} variant="outline" size="sm">
                ✕ Close
              </Button>
            </div>
          </div>
          
          <div className="group-section" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <h3 className="section-subtitle">Members</h3>
              <Badge variant="info" size="sm">{selectedGroup.members.length} Active</Badge>
            </div>
            <div className="members-list">
              {selectedGroup.members.map((member) => (
                <div key={member.id} className="member-item" style={{ padding: '0.75rem', backgroundColor: 'var(--color-success-50)', border: '1px solid var(--color-success-200)', borderRadius: 'var(--radius-md)', marginBottom: '0.5rem' }}>
                  <div className="member-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <p className="member-name" style={{ fontWeight: 'var(--font-weight-semibold)', margin: 0 }}>{member.name}</p>
                      <Badge variant="success" size="sm">✓ Member</Badge>
                    </div>
                    <p className="member-email" style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: 'var(--font-size-sm)' }}>{member.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="group-section">
            <h3 className="section-subtitle">Add Member</h3>
            <form onSubmit={handleAddMember} className="form">
              <Input
                type="email"
                label="Friend's Email"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                placeholder="friend@email.com"
                required
                helpText="Only your friends can be added to groups. Add them as friends first if needed."
              />
              <Button type="submit" variant="primary" loading={memberLoading} fullWidth>
                {memberLoading ? 'Adding Member...' : '➕ Add to Group'}
              </Button>
            </form>
          </div>
        </Card>
      )}
    </>
  );
};

export default Groups;
