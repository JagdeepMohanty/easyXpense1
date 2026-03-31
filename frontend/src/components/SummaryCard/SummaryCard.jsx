import Money from '../Money';
import './SummaryCard.css';

const SummaryCard = ({
  title,
  value,
  subtitle,
  icon,
  variant = 'default',
  trend,
  className = ''
}) => {
  const classes = [
    'summary-card',
    `summary-card--${variant}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <div className="summary-card__header">
        {icon && (
          <div className="summary-card__icon">
            {icon}
          </div>
        )}
        <div className="summary-card__title-section">
          <h3 className="summary-card__title">{title}</h3>
          {subtitle && (
            <p className="summary-card__subtitle">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="summary-card__value">
        {typeof value === 'number' ? (
          <Money 
            amount={value} 
            variant={variant === 'owe' ? 'owe' : variant === 'owed' ? 'owed' : 'emphasis'} 
            size="2xl"
          />
        ) : (
          <span className="summary-card__value-text">{value}</span>
        )}
      </div>

      {trend && (
        <div className="summary-card__trend">
          <span className={`summary-card__trend-indicator summary-card__trend-indicator--${trend.type}`}>
            {trend.type === 'up' ? '↗' : trend.type === 'down' ? '↘' : '→'}
          </span>
          <span className="summary-card__trend-text">{trend.text}</span>
        </div>
      )}
    </div>
  );
};

export default SummaryCard;