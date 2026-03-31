import Button from '../Button';
import './EmptyState.css';

const EmptyState = ({
  icon,
  title,
  description,
  action,
  className = ''
}) => {
  const classes = ['empty-state', className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {icon && (
        <div className="empty-state__icon">
          {icon}
        </div>
      )}
      
      <div className="empty-state__content">
        <h3 className="empty-state__title">{title}</h3>
        {description && (
          <p className="empty-state__description">{description}</p>
        )}
      </div>

      {action && (
        <div className="empty-state__action">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;