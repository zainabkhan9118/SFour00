import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';

/**
 * ProgressTracker Component
 * 
 * A reusable component that displays a visual progress tracker for multi-step forms.
 * 
 * @param {Object[]} steps - Array of step objects with format: 
 *   { id: number, name: string, path: string, completed: boolean, active: boolean }
 * @param {Object} options - Additional options for styling the progress tracker
 * @param {boolean} options.showConnectors - Whether to show connector lines between steps (default: true)
 * @param {string} options.className - Additional CSS classes to apply to the container
 * @returns {JSX.Element} The ProgressTracker component
 */
const ProgressTracker = ({ steps, options = {} }) => {
  const navigate = useNavigate();
  const { showConnectors = true, className = '' } = options;

  return (
    <div className={`w-full max-w-4xl mx-auto mb-8 ${className}`}>
      <div className="relative flex justify-between items-center">
        {showConnectors && (
          <>
            {/* Step connectors - individual segments between steps */}
            {steps.slice(0, -1).map((step, idx) => (
              <div 
                key={`connector-${idx}`}
                className={`absolute h-0.5 transform -translate-y-1/2 ${
                  step.completed ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}
                style={{
                  top: '1.25rem',
                  left: `calc(${((idx * 100)+2) / (steps.length - 1)}%)`,
                  width: `calc(${100 / (steps.length - 0.9)}%)`,
                  zIndex: 1
                }}
              />
            ))}
          </>
        )}
        
        {/* Step circles */}
        {steps.map((step) => (
          <div 
            key={step.id} 
            className="flex flex-col items-center relative cursor-pointer z-10"
            onClick={() => navigate(step.path)}
          >
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 
                ${step.active && !step.completed ? 'bg-orange-500 text-white border-2 border-orange-500' : 
                  step.completed ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300'}`}
            >
              {step.completed ? (
                <FaCheck className="text-white" />
              ) : (
                <span>{step.id}</span>
              )}
            </div>
            <span 
              className={`text-xs font-medium text-center ${
                step.active || step.completed ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              {step.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker;
