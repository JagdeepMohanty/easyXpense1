import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Alert, EmptyState, LoadingSpinner, ExpenseCard, PageHeader, Breadcrumb, FormWizard, Badge } from '../components';
import api from '../services/api';

const Expenses = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [groupMembers, setGroupMembers] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [participants, setParticipants] = useState([]);
  const [groupExpenses, setGroupExpenses] = useState([]);
  const [userExpenses, setUserExpenses] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('easyxpense_token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchGroups();
    fetchUserExpenses();
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

  const fetchGroupDetails = async (groupId) => {
    try {
      const response = await api.get(`/groups/${groupId}`);
      setGroupMembers(response.data.members);
      setPaidBy('');
      setParticipants([]);
    } catch (err) {
      console.error('Error fetching group details:', err);
    }
  };

  const fetchGroupExpenses = async (groupId) => {
    try {
      const response = await api.get(`/expenses/groups/${groupId}`);
      setGroupExpenses(response.data);
    } catch (err) {
      console.error('Error fetching group expenses:', err);
    }
  };

  const fetchUserExpenses = async () => {
    try {
      const response = await api.get('/expenses');
      setUserExpenses(response.data);
    } catch (err) {
      console.error('Error fetching user expenses:', err);
    }
  };

  const handleGroupChange = (groupId) => {
    setSelectedGroup(groupId);
    if (groupId) {
      fetchGroupDetails(groupId);
      fetchGroupExpenses(groupId);
    } else {
      setGroupMembers([]);
      setGroupExpenses([]);
    }
  };

  const handleParticipantToggle = (memberId) => {
    setParticipants(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleCreateExpense = async (formData) => {
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/expenses', {
        group_id: formData.group_id,
        description: formData.description,
        amount: parseFloat(formData.amount),
        paid_by: formData.paid_by,
        participants: formData.participants
      });
      setMessage(`${response.data.message}! Split: ₹${response.data.split_amount} per person`);
      setShowWizard(false);
      fetchGroupExpenses(formData.group_id);
      fetchUserExpenses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create expense');
    } finally {
      setLoading(false);
    }
  };

  const expenseWizardSteps = [
    {
      title: "Select Group",
      description: "Choose which group this expense belongs to",
      component: ({ data, onNext, onCancel }) => {
        const [selectedGroup, setSelectedGroup] = useState(data.group_id || '');
        const [groupMembers, setGroupMembers] = useState([]);
        const [stepLoading, setStepLoading] = useState(false);
        const [stepError, setStepError] = useState('');

        const handleNext = async () => {
          if (!selectedGroup) {
            setStepError('Please select a group');
            return;
          }
          
          setStepLoading(true);
          try {
            const response = await api.get(`/groups/${selectedGroup}`);
            setStepError('');
            onNext({ 
              group_id: selectedGroup, 
              group_members: response.data.members,
              group_name: groups.find(g => g.id === selectedGroup)?.name
            });
          } catch (err) {
            setStepError('Failed to load group details');
          } finally {
            setStepLoading(false);
          }
        };

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {stepError && <Alert variant="error">{stepError}</Alert>}
            
            <Input
              type="select"
              label="Select Group"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              required
            >
              <option value="">-- Choose a group --</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </Input>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <Button onClick={onCancel} variant="outline">Cancel</Button>
              <Button onClick={handleNext} variant="primary" loading={stepLoading}>
                Next: Expense Details
              </Button>
            </div>
          </div>
        );
      }
    },
    {
      title: "Expense Details",
      description: "Enter the expense description and amount",
      component: ({ data, onNext, onPrevious }) => {
        const [description, setDescription] = useState(data.description || '');
        const [amount, setAmount] = useState(data.amount || '');
        const [stepError, setStepError] = useState('');

        const handleNext = () => {
          if (!description.trim()) {
            setStepError('Please enter a description');
            return;
          }
          if (!amount || parseFloat(amount) <= 0) {
            setStepError('Please enter a valid amount');
            return;
          }
          setStepError('');
          onNext({ description: description.trim(), amount: parseFloat(amount) });
        };

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {stepError && <Alert variant="error">{stepError}</Alert>}
            
            <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Badge variant="primary" size="sm">Group</Badge>
                <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>{data.group_name}</span>
              </div>
            </div>

            <Input
              type="text"
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Dinner, Movie tickets, Groceries..."
              required
            />

            <Input
              type="number"
              label="Amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1200"
              step="0.01"
              min="0"
              required
            />

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
              <Button onClick={onPrevious} variant="outline">Previous</Button>
              <Button onClick={handleNext} variant="primary">
                Next: Who Paid?
              </Button>
            </div>
          </div>
        );
      }
    },
    {
      title: "Payment & Split",
      description: "Select who paid and who should split the expense",
      component: ({ data, onNext, onPrevious }) => {
        const [paidBy, setPaidBy] = useState(data.paid_by || '');
        const [participants, setParticipants] = useState(data.participants || []);
        const [stepError, setStepError] = useState('');

        const handleParticipantToggle = (memberId) => {
          setParticipants(prev => 
            prev.includes(memberId) 
              ? prev.filter(id => id !== memberId)
              : [...prev, memberId]
          );
        };

        const handleNext = () => {
          if (!paidBy) {
            setStepError('Please select who paid for this expense');
            return;
          }
          if (participants.length === 0) {
            setStepError('Please select at least one participant to split the expense');
            return;
          }
          setStepError('');
          onNext({ paid_by: paidBy, participants });
        };

        const splitAmount = data.amount && participants.length > 0 ? (data.amount / participants.length).toFixed(2) : '0.00';

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {stepError && <Alert variant="error">{stepError}</Alert>}
            
            <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>{data.description}</span>
                <Badge variant="success" size="sm">₹{data.amount}</Badge>
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                Split among {participants.length} {participants.length === 1 ? 'person' : 'people'}: ₹{splitAmount} each
              </div>
            </div>

            <Input
              type="select"
              label="Who Paid?"
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              required
            >
              <option value="">-- Select who paid --</option>
              {data.group_members?.map((member) => (
                <option key={member.id} value={member.id}>{member.name}</option>
              ))}
            </Input>

            <div className="form-group">
              <label className="form-label">Who should split this expense?</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginTop: '0.5rem' }}>
                {data.group_members?.map((member) => (
                  <label key={member.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', backgroundColor: participants.includes(member.id) ? 'var(--color-primary-50)' : 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', cursor: 'pointer', border: participants.includes(member.id) ? '1px solid var(--color-primary-200)' : '1px solid var(--color-border-primary)' }}>
                    <input
                      type="checkbox"
                      checked={participants.includes(member.id)}
                      onChange={() => handleParticipantToggle(member.id)}
                      style={{ margin: 0 }}
                    />
                    <span>{member.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
              <Button onClick={onPrevious} variant="outline">Previous</Button>
              <Button onClick={handleNext} variant="primary" loading={loading}>
                Create Expense
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
          title="Expenses" 
          description="Track and split expenses with your groups"
          breadcrumb={
            <Breadcrumb 
              items={[
                { label: 'Home', path: '/' },
                { label: 'Expenses' }
              ]} 
            />
          }
        />
        <Card>
          <LoadingSpinner size="lg" text="Loading expenses..." />
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader 
        title="Expenses" 
        description="Track and split expenses with your groups"
        breadcrumb={
          <Breadcrumb 
            items={[
              { label: 'Home', path: '/' },
              { label: 'Expenses' }
            ]} 
          />
        }
      />

      {message && <Alert variant="success" style={{ marginBottom: '20px' }}>{message}</Alert>}
      {error && <Alert variant="error" style={{ marginBottom: '20px' }}>{error}</Alert>}

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 className="card-title">Create Expense</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Badge variant="info" size="sm">{groups.length} Groups</Badge>
            <Badge variant="secondary" size="sm">{userExpenses.length} Total Expenses</Badge>
          </div>
        </div>
        
        {groups.length === 0 ? (
          <EmptyState
            icon="👥"
            title="No groups found"
            description="You need to be part of a group to create expenses. Create or join a group first."
            action={
              <Button onClick={() => navigate('/groups')} variant="primary">
                Go to Groups
              </Button>
            }
          />
        ) : showWizard ? (
          <FormWizard
            steps={expenseWizardSteps}
            onComplete={handleCreateExpense}
            onCancel={() => setShowWizard(false)}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '3rem' }}>💰</span>
            </div>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>Ready to add an expense?</h3>
            <p style={{ marginBottom: '1.5rem', color: 'var(--color-text-secondary)' }}>Use our step-by-step wizard to quickly split expenses with your group.</p>
            <Button onClick={() => setShowWizard(true)} variant="primary" size="lg">
              ✨ Create New Expense
            </Button>
          </div>
        )}
      </Card>

      {selectedGroup && groupExpenses.length > 0 && (
        <Card>
          <h2 className="card-title">Group Expenses ({groupExpenses.length})</h2>
          <div className="expenses-list">
            {groupExpenses.map((expense) => (
              <ExpenseCard 
                key={expense.id} 
                expense={expense} 
                showGroup={false}
              />
            ))}
          </div>
        </Card>
      )}

      <Card>
        <h2 className="card-title">Your Expenses ({userExpenses.length})</h2>
        {userExpenses.length === 0 ? (
          <EmptyState
            icon="💰"
            title="No expenses yet"
            description="Create an expense to get started!"
          />
        ) : (
          <div className="expenses-list">
            {userExpenses.map((expense) => (
              <ExpenseCard 
                key={expense.id} 
                expense={expense} 
                showGroup={true}
              />
            ))}
          </div>
        )}
      </Card>
    </>
  );
};

export default Expenses;
