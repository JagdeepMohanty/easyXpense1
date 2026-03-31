import './LoadingSpinner.css';

const LoadingSpinner = ({
  size = 'base',
  variant = 'primary',
  text,
  overlay = false,
  className = ''
}) => {
  const baseClass = 'loading-spinner';
  const sizeClass = `loading-spinner--${size}`;
  const variantClass = `loading-spinner--${variant}`;
  const overlayClass = overlay ? 'loading-spinner--overlay' : '';
  
  const classes = [
    baseClass,
    sizeClass,
    variantClass,
    overlayClass,
    className
  ].filter(Boolean).join(' ');

  const content = (
    <div className="loading-spinner__content">
      <div className="loading-spinner__circle">
        <div className="loading-spinner__inner"></div>
      </div>
      {text && <p className="loading-spinner__text">{text}</p>}
    </div>
  );

  if (overlay) {
    return (
      <div className={classes}>
        {content}
      </div>
    );
  }

  return <div className={classes}>{content}</div>;
};

export default LoadingSpinner;