import Money from '../Money';
import Badge from '../Badge';
import Button from '../Button';
import './DebtCard.css';

const DebtCard = ({
  debt,
  type, // 'owe' or 'owed'
  onSettle,
  showSettleButton = false,
  className = ''
}) => {
  const isOwe = type === 'owe';
  const classes = [
    'debt-card',
    `debt-card--${type}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <div className="debt-card__header">
        <div className="debt-card__user">
          <div className="debt-card__avatar">
            {debt.name.charAt(0).toUpperCase()}
          </div>
          <div className="debt-card__user-info">
            <h3 className="debt-card__name">{debt.name}</h3>
            <p className="debt-card__email">{debt.email}</p>
          </div>
        </div>
        <Badge variant={isOwe ? 'owe' : 'owed'} size="sm">
          {isOwe ? 'You Owe' : 'Owes You'}
        </Badge>
      </div>

      <div className="debt-card__amount">
        <Money 
          amount={debt.amount} 
          variant={isOwe ? 'owe' : 'owed'} 
          size="xl"
        />
      </div>

      {debt.group_name && (
        <div className="debt-card__group">
          <span className="debt-card__group-label">Group:</span>
          <span className="debt-card__group-name">{debt.group_name}</span>
        </div>
      )}

      {showSettleButton && isOwe && onSettle && (
        <div className="debt-card__actions">
          <Button 
            variant="primary" 
            size="sm" 
            fullWidth
            onClick={() => onSettle(debt)}
          >
            Settle Debt
          </Button>
        </div>
      )}
    </div>
  );
};

export default DebtCard;