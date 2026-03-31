import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Alert, DebtCard, SummaryCard, LoadingSpinner, PageHeader, Breadcrumb, Badge, EmptyState } from '../components';
import api from '../services/api';

const Home = ({ user: propUser, onLogout: propOnLogout }) => {
  const [status, setStatus] = useState('Loading...');
  const [user, setUser] = useState(propUser);
  const [loading, setLoading] = useState(!propUser);
  const [debts, setDebts] = useState({ you_owe: [], you_are_owed: [] });
  const [analytics, setAnalytics] = useState(null);
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
      if (propUser) {
        setUser(propUser);
        fetchDebts();
        fetchAnalytics();
        setLoading(false);
      } else {
        const token = localStorage.getItem('easyxpense_token');
        if (token) {
          try {
            const response = await api.get('/auth/me');
            setUser(response.data);
            fetchDebts();
            fetchAnalytics();
          } catch (error) {
            localStorage.removeItem('easyxpense_token');
          }
        }
        setLoading(false);
      }
    };

    const fetchDebts = async () => {
      try {
        const response = await api.get('/debts');
        setDebts(response.data);
      } catch (error) {
        console.error('Error fetching debts:', error);
      }
    };

    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/analytics');
        setAnalytics(response.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchHealth();
    fetchUser();
  }, [propUser]);

  const handleLogout = () => {
    if (propOnLogout) {
      propOnLogout();
    } else {
      localStorage.removeItem('easyxpense_token');
      setUser(null);
      setDebts({ you_owe: [], you_are_owed: [] });
      setAnalytics(null);
    }
  };

  if (loading) {
    return (
      <>
        <PageHeader 
          title="Dashboard" 
          description="Welcome to EasyXpense - Your expense tracking companion"
        />
        <Card>
          <LoadingSpinner size="lg" text="Loading your dashboard..." />
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader 
        title="Dashboard" 
        description="Manage your expenses and track debts with friends"
        breadcrumb={
          <Breadcrumb 
            items={[
              { label: 'Home', path: '/' }
            ]} 
          />
        }
      />
      
      <Card>
        <h2 className="card-title">Backend Status:</h2>
        <p className="card-text">{status}</p>
      </Card>

      {user ? (
        <>
          {/* Welcome Card */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h2 className="card-title">Welcome back, {user.name}!</h2>
                <p className="card-text" style={{ margin: 0, color: 'var(--color-text-secondary)' }}>{user.email}</p>
              </div>
              <Badge variant="success" size="sm">Active</Badge>
            </div>
            <div className="button-group">
              <Button onClick={() => navigate('/friends')} variant="primary">Friends</Button>
              <Button onClick={() => navigate('/groups')} variant="primary">Groups</Button>
              <Button onClick={() => navigate('/expenses')} variant="primary">Expenses</Button>
              <Button onClick={() => navigate('/settlement')} variant="secondary">Settle Debts</Button>
              <Button onClick={handleLogout} variant="outline">Logout</Button>
            </div>
          </Card>

          {/* Financial Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <SummaryCard
              title="Total You Owe"
              subtitle={`${debts.you_owe.length} ${debts.you_owe.length === 1 ? 'person' : 'people'}`}
              value={debts.you_owe.reduce((sum, debt) => sum + debt.amount, 0)}
              variant="owe"
              icon="💸"
              trend={analytics?.debt_trend ? {
                type: analytics.debt_trend > 0 ? 'up' : analytics.debt_trend < 0 ? 'down' : 'neutral',
                text: `${Math.abs(analytics.debt_trend || 0).toFixed(1)}% from last month`
              } : null}
            />
            <SummaryCard
              title="Total Owed to You"
              subtitle={`${debts.you_are_owed.length} ${debts.you_are_owed.length === 1 ? 'person' : 'people'}`}
              value={debts.you_are_owed.reduce((sum, debt) => sum + debt.amount, 0)}
              variant="owed"
              icon="💰"
            />
            <SummaryCard
              title="Net Balance"
              subtitle="Your overall position"
              value={debts.you_are_owed.reduce((sum, debt) => sum + debt.amount, 0) - debts.you_owe.reduce((sum, debt) => sum + debt.amount, 0)}
              variant={debts.you_are_owed.reduce((sum, debt) => sum + debt.amount, 0) - debts.you_owe.reduce((sum, debt) => sum + debt.amount, 0) >= 0 ? 'owed' : 'owe'}
              icon="⚖️"
            />
          </div>

          {/* Debt Details */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="card-title">Debt Overview</h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Badge variant="owe" size="sm">{debts.you_owe.length} Owe</Badge>
                <Badge variant="owed" size="sm">{debts.you_are_owed.length} Owed</Badge>
              </div>
            </div>
            
            <div className="debt-section">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <h3 className="debt-subtitle">You Owe</h3>
                <Badge variant="owe" size="sm">${debts.you_owe.reduce((sum, debt) => sum + debt.amount, 0).toFixed(2)}</Badge>
              </div>
              {debts.you_owe.length === 0 ? (
                <EmptyState
                  icon="🎉"
                  title="All clear!"
                  description="You don't owe anyone money right now."
                  action={
                    <Button 
                      onClick={() => navigate('/expenses')} 
                      variant="primary" 
                      size="sm"
                    >
                      Add Expense
                    </Button>
                  }
                />
              ) : (
                <div className="debt-list">
                  {debts.you_owe.map((debt) => (
                    <DebtCard 
                      key={debt.user_id} 
                      debt={debt} 
                      type="owe" 
                      showSettleButton={true}
                      onSettle={() => navigate('/settlement')}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="debt-section" style={{ marginTop: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <h3 className="debt-subtitle">Owed To You</h3>
                <Badge variant="owed" size="sm">${debts.you_are_owed.reduce((sum, debt) => sum + debt.amount, 0).toFixed(2)}</Badge>
              </div>
              {debts.you_are_owed.length === 0 ? (
                <EmptyState
                  icon="💭"
                  title="No pending payments"
                  description="Nobody owes you money at the moment."
                  action={
                    <Button 
                      onClick={() => navigate('/friends')} 
                      variant="outline" 
                      size="sm"
                    >
                      Invite Friends
                    </Button>
                  }
                />
              ) : (
                <div className="debt-list">
                  {debts.you_are_owed.map((debt) => (
                    <DebtCard 
                      key={debt.user_id} 
                      debt={debt} 
                      type="owed" 
                    />
                  ))}
                </div>
              )}
            </div>
          </Card>
        </>
      ) : (
        <EmptyState
          icon="🚀"
          title="Welcome to EasyXpense"
          description="Track expenses, split bills, and manage debts with friends effortlessly. Get started by creating an account or logging in."
          action={
            <div className="button-group">
              <Button onClick={() => navigate('/login')} variant="primary">Login</Button>
              <Button onClick={() => navigate('/signup')} variant="secondary">Sign Up</Button>
            </div>
          }
        />
      )}
    </>
  );
};

export default Home;
