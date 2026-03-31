import LoadingSpinner from '../LoadingSpinner';
import './LoadingOverlay.css';

const LoadingOverlay = ({ 
  isVisible = false, 
  message = 'Loading...', 
  backdrop = true,
  size = 'lg',
  className = '' 
}) => {
  if (!isVisible) return null;

  const classes = [
    'loading-overlay',
    backdrop ? 'loading-overlay--backdrop' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} role="status" aria-live="polite">
      <div className="loading-overlay__content">
        <LoadingSpinner size={size} />
        <p className="loading-overlay__message">{message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;