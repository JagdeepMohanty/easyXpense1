import './Input.css';

const Input = ({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  success,
  disabled = false,
  required = false,
  size = 'base',
  fullWidth = false,
  className = '',
  helpText,
  id,
  children, // for select options
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const helpTextId = helpText ? `${inputId}-help` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const baseClass = 'input';
  const sizeClass = `input--${size}`;
  const fullWidthClass = fullWidth ? 'input--full-width' : '';
  const errorClass = error ? 'input--error' : '';
  const successClass = success ? 'input--success' : '';
  const disabledClass = disabled ? 'input--disabled' : '';
  
  const inputClasses = [
    baseClass,
    sizeClass,
    fullWidthClass,
    errorClass,
    successClass,
    disabledClass,
    className
  ].filter(Boolean).join(' ');

  const InputElement = type === 'select' ? 'select' : 'input';

  return (
    <div className="input-group">
      {label && (
        <label className="input-label" htmlFor={inputId}>
          {label}
          {required && <span className="input-required" aria-label="required">*</span>}
        </label>
      )}
      
      <InputElement
        id={inputId}
        type={type === 'select' ? undefined : type}
        className={inputClasses}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={[helpTextId, errorId].filter(Boolean).join(' ') || undefined}
        {...props}
      >
        {children}
      </InputElement>
      
      {helpText && (
        <span id={helpTextId} className="input-message input-message--help">
          {helpText}
        </span>
      )}
      {error && (
        <span id={errorId} className="input-message input-message--error" role="alert">
          {error}
        </span>
      )}
      {success && <span className="input-message input-message--success">{success}</span>}
    </div>
  );
};

export default Input;