import './CardEnhanced.css';

const CardEnhanced = ({ 
  children, 
  variant = 'default',
  padding = 'base',
  className = '',
  ...props 
}) => {
  const baseClass = 'card-enhanced';
  const variantClass = `card-enhanced--${variant}`;
  const paddingClass = `card-enhanced--padding-${padding}`;
  
  const classes = [
    baseClass,
    variantClass,
    paddingClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default CardEnhanced;