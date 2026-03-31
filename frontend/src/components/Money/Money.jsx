import './Money.css';

const Money = ({
  amount,
  currency = '₹',
  variant = 'default',
  size = 'base',
  showSign = false,
  className = '',
  ...props
}) => {
  const formatAmount = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '0.00';
    
    // Format with commas for thousands
    return num.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const getSign = () => {
    if (!showSign) return '';
    const num = parseFloat(amount);
    if (num > 0) return '+';
    if (num < 0) return '-';
    return '';
  };

  const baseClass = 'money';
  const variantClass = `money--${variant}`;
  const sizeClass = `money--${size}`;
  
  const classes = [
    baseClass,
    variantClass,
    sizeClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} {...props}>
      <span className="money__sign">{getSign()}</span>
      <span className="money__currency">{currency}</span>
      <span className="money__amount">{formatAmount(Math.abs(amount))}</span>
    </span>
  );
};

export default Money;