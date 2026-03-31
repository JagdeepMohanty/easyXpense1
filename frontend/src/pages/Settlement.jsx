import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Alert, EmptyState, LoadingSpinner, DebtCard, Money, PageHeader, Breadcrumb, Badge, SummaryCard, FormWizard } from '../components';
import api from '../services/api';

const Settlement = () => {
  const navigate = useNavigate();
  const [debts, setDebts] = useState({ you_owe: [], you_are_owed: [] });
  const [groups, setGroups] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('easyxpense_token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchDebts();
    fetchGroups();
    fetchSettlements();
    fetchAnalytics();
  }, [navigate]);

  const fetchDebts = async () => {
    try {
      const response = await api.get('/debts');
      setDebts(response.data);
    } catch (err) {
      console.error('Error fetching debts:', err);
    } finally {
      setPageLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await api.get('/groups');
      setGroups(response.data);
    } catch (err) {
      console.error('Error fetching groups:', err);
    }
  };

  const fetchSettlements = async () => {
    try {
      const response = await api.get('/settlements');
      setSettlements(response.data);
    } catch (err) {
      console.error('Error fetching settlements:', err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/analytics');
      setAnalytics(response.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  const handleSettle = async (formData) => {
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/settlements', {
        receiver_id: formData.receiver_id,
        group_id: formData.group_id,
        amount: parseFloat(formData.amount)
      });
      setMessage(response.data.message);
      setShowWizard(false);
      fetchDebts();
      fetchSettlements();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  const settlementWizardSteps = [
    {
      title: "Select Debt",
      description: "Choose which debt you want to settle",
      component: ({ data, onNext, onCancel }) => {
        const [selectedDebt, setSelectedDebt] = useState(data.debt_id || '');
        const [stepError, setStepError] = useState('');

        const handleNext = () => {
          if (!selectedDebt) {
            setStepError('Please select a debt to settle');
            return;
          }
          
          const debt = debts.you_owe.find(d => d.user_id === selectedDebt);
          if (!debt) {
            setStepError('Selected debt not found');
            return;
          }
          
          setStepError('');
          onNext({ 
            debt_id: selectedDebt,
            receiver_id: debt.user_id,
            receiver_name: debt.name,
            max_amount: debt.amount,
            group_id: debt.group_id || groups[0]?.id
          });
        };

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {stepError && <Alert variant="error">{stepError}</Alert>}
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              {debts.you_owe.map((debt) => (
                <label 
                  key={debt.user_id} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem', 
                    padding: '1rem', 
                    backgroundColor: selectedDebt === debt.user_id ? 'var(--color-primary-50)' : 'var(--color-bg-tertiary)', 
                    borderRadius: 'var(--radius-md)', 
                    cursor: 'pointer',
                    border: selectedDebt === debt.user_id ? '2px solid var(--color-primary-500)' : '1px solid var(--color-border-primary)'
                  }}
                >
                  <input
                    type="radio"
                    name="debt"
                    value={debt.user_id}
                    checked={selectedDebt === debt.user_id}
                    onChange={(e) => setSelectedDebt(e.target.value)}
                    style={{ margin: 0 }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'var(--font-weight-semibold)', marginBottom: '0.25rem' }}>
                      Pay {debt.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Money amount={debt.amount} variant="owe" size="sm" />
                      <Badge variant="owe" size="sm">Outstanding</Badge>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <Button onClick={onCancel} variant="outline">Cancel</Button>
              <Button onClick={handleNext} variant="primary">
                Next: Enter Amount
              </Button>
            </div>
          </div>
        );
      }
    },
    {
      title: "Payment Amount",
      description: "Enter the amount you want to pay",
      component: ({ data, onNext, onPrevious }) => {
        const [amount, setAmount] = useState(data.amount || '');
        const [stepError, setStepError] = useState('');

        const handleNext = () => {
          if (!amount || parseFloat(amount) <= 0) {
            setStepError('Please enter a valid amount');
            return;
          }
          if (parseFloat(amount) > data.max_amount) {
            setStepError(`Amount cannot exceed ₹${data.max_amount}`);
            return;
          }
          setStepError('');
          onNext({ amount: parseFloat(amount) });
        };

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {stepError && <Alert variant="error">{stepError}</Alert>}
            
            <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>Paying to: {data.receiver_name}</span>
                <Badge variant="info" size="sm">Max: ₹{data.max_amount}</Badge>
              </div>
            </div>

            <Input
              type="number"
              label="Payment Amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Max: ${data.max_amount}`}
              step="0.01"
              min="0.01"
              max={data.max_amount}
              required
              helpText={`You can pay any amount up to ₹${data.max_amount}`}
            />

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
              <Button onClick={onPrevious} variant="outline">Previous</Button>
              <Button onClick={handleNext} variant="primary" loading={loading}>
                Record Payment
              </Button>
            </div>
          </div>
        );
      }
    }
  ];

  if (pageLoading) {
    return (
      <>
        <PageHeader 
          title="Settle Debts" 
          description="Pay your debts and track settlement history"
          breadcrumb={
            <Breadcrumb 
              items={[
                { label: 'Home', path: '/' },
                { label: 'Settlement' }
              ]} 
            />
          }
        />
        <Card>
          <LoadingSpinner size="lg" text="Loading settlements..." />
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader 
        title="Settle Debts" 
        description="Pay your debts and track settlement history"
        breadcrumb={
          <Breadcrumb 
            items={[
              { label: 'Home', path: '/' },
              { label: 'Settlement' }
            ]} 
          />
        }
      />

      {message && <Alert variant="success" style={{ marginBottom: '20px' }}>{message}</Alert>}
      {error && <Alert variant="error" style={{ marginBottom: '20px' }}>{error}</Alert>}

      {/* Settlement Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <SummaryCard
          title="Total Outstanding"
          subtitle={`${debts.you_owe.length} ${debts.you_owe.length === 1 ? 'debt' : 'debts'}`}
          value={debts.you_owe.reduce((sum, debt) => sum + debt.amount, 0)}
          variant="owe"
          icon="💸"
        />
        <SummaryCard
          title="Settlements Made"
          subtitle="This month"
          value={settlements.length}
          variant="success"
          icon="✅"
        />
        <SummaryCard
          title="Settlement Progress"
          subtitle="Debts cleared"
          value={`${Math.round((settlements.length / Math.max(settlements.length + debts.you_owe.length, 1)) * 100)}%`}
          variant="info"
          icon="📈"
        />
      </div>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 className="card-title">Your Outstanding Debts</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Badge variant="owe" size="sm">{debts.you_owe.length} Pending</Badge>
            <Badge variant="info" size="sm">₹{debts.you_owe.reduce((sum, debt) => sum + debt.amount, 0).toFixed(2)}</Badge>
          </div>
        </div>
        
        {debts.you_owe.length === 0 ? (
          <EmptyState
            icon="🎉"
            title="All debts settled!"
            description="You don't have any outstanding debts. Great job keeping your finances in order!"
            action={
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button onClick={() => navigate('/expenses')} variant="primary" size="sm">
                  Add New Expense
                </Button>
                <Button onClick={() => navigate('/')} variant="outline" size="sm">
                  Back to Dashboard
                </Button>
              </div>
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
                onSettle={() => setShowWizard(true)}
              />
            ))}
          </div>
        )}
      </Card>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 className="card-title">Record Settlement</h2>
          <Badge variant="primary" size="sm">Quick Pay</Badge>
        </div>
        
        {debts.you_owe.length === 0 ? (
          <EmptyState
            icon="✨"
            title="No debts to settle"
            description="You're all caught up! Come back when you have debts to settle."
          />
        ) : showWizard ? (
          <FormWizard
            steps={settlementWizardSteps}
            onComplete={handleSettle}
            onCancel={() => setShowWizard(false)}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '3rem' }}>💳</span>
            </div>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>Ready to settle a debt?</h3>
            <p style={{ marginBottom: '1.5rem', color: 'var(--color-text-secondary)' }}>Use our guided process to record your payments quickly and accurately.</p>
            <Button onClick={() => setShowWizard(true)} variant="primary" size="lg">
              💰 Record Payment
            </Button>
          </div>
        )}
      </Card>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 className="card-title">Settlement History</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Badge variant="success" size="sm">{settlements.length} Completed</Badge>
            <Badge variant="info" size="sm">₹{settlements.reduce((sum, s) => sum + s.amount, 0).toFixed(2)} Total</Badge>
          </div>
        </div>
        {settlements.length === 0 ? (
          <EmptyState
            icon="📄"
            title="No settlement history"
            description="Your payment records will appear here once you start settling debts."
            action={
              debts.you_owe.length > 0 ? (
                <Button onClick={() => setShowWizard(true)} variant="primary" size="sm">
                  Make First Payment
                </Button>
              ) : null
            }
          />
        ) : (
          <div className="settlements-list">
            {settlements.map((settlement) => (
              <div key={settlement.id} className="settlement-item" style={{ padding: '1rem', backgroundColor: 'var(--color-success-50)', border: '1px solid var(--color-success-200)', borderRadius: 'var(--radius-md)', marginBottom: '0.5rem' }}>
                <div className="settlement-info">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <p className="settlement-text" style={{ fontWeight: 'var(--font-weight-semibold)', margin: 0 }}>
                      {settlement.payer} → {settlement.receiver}
                    </p>
                    <Badge variant="success" size="sm">✓ Settled</Badge>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p className="settlement-details" style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                      Group: {settlement.group_name}
                    </p>
                    <Money amount={settlement.amount} variant="success" size="sm" />
                  </div>
                  <p className="settlement-date" style={{ margin: '0.5rem 0 0 0', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>
                    {new Date(settlement.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
};

export default Settlement;
