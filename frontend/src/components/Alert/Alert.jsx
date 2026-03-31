import { useState } from 'react';
import './Alert.css';

const Alert = ({
  children,
  variant = 'info',
  dismissible = false,
  onDismiss,
  className = '',
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  if (!isVisible) return null;

  const baseClass = 'alert';
  const variantClass = `alert--${variant}`;
  const dismissibleClass = dismissible ? 'alert--dismissible' : '';
  
  const classes = [
    baseClass,
    variantClass,
    dismissibleClass,
    className
  ].filter(Boolean).join(' ');

  const getIcon = () => {
    switch (variant) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={classes} {...props}>
      <div className="alert__icon">
        {getIcon()}
      </div>
      <div className="alert__content">
        {children}
      </div>
      {dismissible && (
        <button 
          className="alert__dismiss"
          onClick={handleDismiss}
          aria-label="Dismiss alert"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default Alert;