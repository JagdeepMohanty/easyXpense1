import { useNavigate } from 'react-router-dom';
import './Breadcrumb.css';

const Breadcrumb = ({ items, className = '' }) => {
  const navigate = useNavigate();

  const handleClick = (path) => {
    if (path) {
      navigate(path);
    }
  };

  const classes = ['breadcrumb', className].filter(Boolean).join(' ');

  return (
    <nav className={classes} aria-label="Breadcrumb">
      <ol className="breadcrumb__list">
        {items.map((item, index) => (
          <li key={index} className="breadcrumb__item">
            {item.path && index < items.length - 1 ? (
              <button
                className="breadcrumb__link"
                onClick={() => handleClick(item.path)}
              >
                {item.label}
              </button>
            ) : (
              <span className="breadcrumb__current">{item.label}</span>
            )}
            {index < items.length - 1 && (
              <span className="breadcrumb__separator" aria-hidden="true">
                /
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;