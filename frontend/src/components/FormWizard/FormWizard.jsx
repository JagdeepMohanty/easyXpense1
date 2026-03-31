import { useState } from 'react';
import Button from '../Button';
import './FormWizard.css';

const FormWizard = ({
  steps,
  onComplete,
  onCancel,
  className = ''
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  const handleNext = (stepData) => {
    const newFormData = { ...formData, ...stepData };
    setFormData(newFormData);

    if (currentStep === steps.length - 1) {
      onComplete(newFormData);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = () => {
    setCurrentStep(0);
    setFormData({});
    if (onCancel) {
      onCancel();
    }
  };

  const currentStepData = steps[currentStep];
  const classes = ['form-wizard', className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {/* Progress Indicator */}
      <div className="form-wizard__progress">
        <div className="form-wizard__progress-bar">
          <div 
            className="form-wizard__progress-fill"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
        <div className="form-wizard__steps">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`form-wizard__step ${
                index <= currentStep ? 'form-wizard__step--active' : ''
              } ${
                index === currentStep ? 'form-wizard__step--current' : ''
              }`}
            >
              <div className="form-wizard__step-number">
                {index < currentStep ? '✓' : index + 1}
              </div>
              <span className="form-wizard__step-label">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="form-wizard__content">
        <div className="form-wizard__header">
          <h2 className="form-wizard__title">{currentStepData.title}</h2>
          {currentStepData.description && (
            <p className="form-wizard__description">{currentStepData.description}</p>
          )}
        </div>

        <div className="form-wizard__body">
          {currentStepData.component({ 
            data: formData, 
            onNext: handleNext,
            onPrevious: handlePrevious,
            onCancel: handleCancel,
            isFirst: currentStep === 0,
            isLast: currentStep === steps.length - 1
          })}
        </div>
      </div>
    </div>
  );
};

export default FormWizard;