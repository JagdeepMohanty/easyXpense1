import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
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
  const navigate = useNavigate();

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

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!selectedGroup) {
      setError('Please select a group');
      return;
    }

    if (!paidBy) {
      setError('Please select who paid');
      return;
    }

    if (participants.length === 0) {
      setError('Please select at least one participant');
      return;
    }

    try {
      const response = await api.post('/expenses', {
        group_id: selectedGroup,
        description,
        amount: parseFloat(amount),
        paid_by: paidBy,
        participants
      });
      setMessage(`${response.data.message}! Split: ₹${response.data.split_amount} per person`);
      setDescription('');
      setAmount('');
      setPaidBy('');
      setParticipants([]);
      fetchGroupExpenses(selectedGroup);
      fetchUserExpenses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create expense');
    }
  };

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <div className="container">
      <h1 className="title">Expenses</h1>

      <button onClick={handleBackHome} className="btn btn-secondary" style={{ marginBottom: '20px' }}>
        Back to Home
      </button>

      {message && <p className="success-text" style={{ marginBottom: '20px' }}>{message}</p>}
      {error && <p className="error-text" style={{ marginBottom: '20px' }}>{error}</p>}

      <Card>
        <h2 className="card-title">Create Expense</h2>
        <form onSubmit={handleCreateExpense} className="form">
          <div className="form-group">
            <label className="form-label">Select Group</label>
            <select
              className="form-input"
              value={selectedGroup}
              onChange={(e) => handleGroupChange(e.target.value)}
              required
            >
              <option value="">-- Select Group --</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </select>
          </div>

          {selectedGroup && (
            <>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  className="form-input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Dinner, Movie, etc."
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Amount (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="1200"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Paid By</label>
                <select
                  className="form-input"
                  value={paidBy}
                  onChange={(e) => setPaidBy(e.target.value)}
                  required
                >
                  <option value="">-- Select Member --</option>
                  {groupMembers.map((member) => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Participants</label>
                <div className="checkbox-group">
                  {groupMembers.map((member) => (
                    <label key={member.id} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={participants.includes(member.id)}
                        onChange={() => handleParticipantToggle(member.id)}
                      />
                      <span className="checkbox-text">{member.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn btn-primary">Create Expense</button>
            </>
          )}
        </form>
      </Card>

      {selectedGroup && groupExpenses.length > 0 && (
        <Card>
          <h2 className="card-title">Group Expenses ({groupExpenses.length})</h2>
          <div className="expenses-list">
            {groupExpenses.map((expense) => (
              <div key={expense.id} className="expense-item">
                <div className="expense-info">
                  <p className="expense-description">{expense.description}</p>
                  <p className="expense-details">
                    Amount: ₹{expense.amount} | Paid by: {expense.paid_by} | Split: ₹{expense.split_amount} each
                  </p>
                  <p className="expense-participants">
                    Participants: {expense.participants.join(', ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <h2 className="card-title">Your Expenses ({userExpenses.length})</h2>
        {userExpenses.length === 0 ? (
          <p className="card-text">No expenses yet. Create an expense to get started!</p>
        ) : (
          <div className="expenses-list">
            {userExpenses.map((expense) => (
              <div key={expense.id} className="expense-item">
                <div className="expense-info">
                  <p className="expense-description">{expense.description}</p>
                  <p className="expense-details">
                    Group: {expense.group_name} | Amount: ₹{expense.amount} | Paid by: {expense.paid_by}
                  </p>
                  <p className="expense-split">Your share: ₹{expense.split_amount}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Expenses;
