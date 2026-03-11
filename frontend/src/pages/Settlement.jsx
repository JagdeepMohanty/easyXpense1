import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import api from '../services/api';

const Settlement = () => {
  const [debts, setDebts] = useState({ you_owe: [], you_are_owed: [] });
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [amount, setAmount] = useState('');
  const [settlements, setSettlements] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('easyxpense_token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchDebts();
    fetchGroups();
    fetchSettlements();
  }, [navigate]);

  const fetchDebts = async () => {
    try {
      const response = await api.get('/debts');
      setDebts(response.data);
    } catch (err) {
      console.error('Error fetching debts:', err);
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

  const handleSettle = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!selectedGroup) {
      setError('Please select a group');
      return;
    }

    if (!receiverId) {
      setError('Please select a person to pay');
      return;
    }

    try {
      const response = await api.post('/settlements', {
        receiver_id: receiverId,
        group_id: selectedGroup,
        amount: parseFloat(amount)
      });
      setMessage(response.data.message);
      setReceiverId('');
      setAmount('');
      setSelectedGroup('');
      fetchDebts();
      fetchSettlements();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record payment');
    }
  };

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <div className="container">
      <h1 className="title">Settle Debts</h1>

      <button onClick={handleBackHome} className="btn btn-secondary" style={{ marginBottom: '20px' }}>
        Back to Home
      </button>

      {message && <p className="success-text" style={{ marginBottom: '20px' }}>{message}</p>}
      {error && <p className="error-text" style={{ marginBottom: '20px' }}>{error}</p>}

      <Card>
        <h2 className="card-title">Your Debts</h2>
        
        {debts.you_owe.length === 0 ? (
          <p className="card-text">You don't owe anyone!</p>
        ) : (
          <div className="debt-list">
            {debts.you_owe.map((debt) => (
              <div key={debt.user_id} className="debt-item debt-owe">
                <span className="debt-text">You owe {debt.name}</span>
                <span className="debt-amount">₹{debt.amount}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <h2 className="card-title">Settle Payment</h2>
        <form onSubmit={handleSettle} className="form">
          <div className="form-group">
            <label className="form-label">Select Group</label>
            <select
              className="form-input"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              required
            >
              <option value="">-- Select Group --</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Pay To</label>
            <select
              className="form-input"
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
              required
            >
              <option value="">-- Select Person --</option>
              {debts.you_owe.map((debt) => (
                <option key={debt.user_id} value={debt.user_id}>
                  {debt.name} (₹{debt.amount})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Amount (₹)</label>
            <input
              type="number"
              className="form-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="300"
              min="0"
              step="0.01"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">Settle Payment</button>
        </form>
      </Card>

      <Card>
        <h2 className="card-title">Settlement History ({settlements.length})</h2>
        {settlements.length === 0 ? (
          <p className="card-text">No settlements yet.</p>
        ) : (
          <div className="settlements-list">
            {settlements.map((settlement) => (
              <div key={settlement.id} className="settlement-item">
                <div className="settlement-info">
                  <p className="settlement-text">
                    {settlement.payer} paid {settlement.receiver}
                  </p>
                  <p className="settlement-details">
                    Group: {settlement.group_name} | Amount: ₹{settlement.amount}
                  </p>
                  <p className="settlement-date">
                    {new Date(settlement.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Settlement;
