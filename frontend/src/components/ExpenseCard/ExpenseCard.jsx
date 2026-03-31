import Money from '../Money';
import Badge from '../Badge';
import './ExpenseCard.css';

const ExpenseCard = ({
  expense,
  showGroup = false,
  className = ''
}) => {
  const classes = ['expense-card', className].filter(Boolean).join(' ');

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className={classes}>
      <div className="expense-card__header">
        <div className="expense-card__title-section">
          <h3 className="expense-card__description">{expense.description}</h3>
          {expense.created_at && (
            <span className="expense-card__date">
              {formatDate(expense.created_at)}
            </span>
          )}
        </div>
        <div className="expense-card__amount-section">
          <Money 
            amount={expense.amount} 
            variant="emphasis" 
            size="lg"
          />
        </div>
      </div>

      <div className="expense-card__details">
        <div className="expense-card__detail-row">
          <span className="expense-card__label">Paid by:</span>
          <span className="expense-card__value">{expense.paid_by}</span>
        </div>

        {showGroup && expense.group_name && (
          <div className="expense-card__detail-row">
            <span className="expense-card__label">Group:</span>
            <Badge variant="secondary" size="sm">
              {expense.group_name}
            </Badge>
          </div>
        )}

        <div className="expense-card__detail-row">
          <span className="expense-card__label">Split:</span>
          <Money 
            amount={expense.split_amount} 
            variant="positive" 
            size="base"
          />
          <span className="expense-card__split-text">per person</span>
        </div>
      </div>

      {expense.participants && expense.participants.length > 0 && (
        <div className="expense-card__participants">
          <span className="expense-card__participants-label">Participants:</span>
          <div className="expense-card__participants-list">
            {expense.participants.map((participant, index) => (
              <Badge key={index} variant="info" size="sm">
                {participant}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseCard;