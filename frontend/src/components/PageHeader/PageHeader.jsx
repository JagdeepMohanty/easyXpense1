import './PageHeader.css';

const PageHeader = ({
  title,
  description,
  actions,
  breadcrumb,
  className = '',
  children
}) => {
  const classes = ['page-header', className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {breadcrumb && (
        <div className="page-header__breadcrumb">
          {breadcrumb}
        </div>
      )}
      
      <div className="page-header__content">
        <div className="page-header__text">
          <h1 className="page-header__title">{title}</h1>
          {description && (
            <p className="page-header__description">{description}</p>
          )}
        </div>
        
        {actions && (
          <div className="page-header__actions">
            {actions}
          </div>
        )}
      </div>
      
      {children && (
        <div className="page-header__extra">
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;