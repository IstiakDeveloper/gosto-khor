import React from 'react';

interface InputErrorProps {
  message?: string;
  className?: string;
}

const InputError: React.FC<InputErrorProps> = ({ message, className = '' }) => {
  if (!message) {
    return null;
  }

  return (
    <p className={`text-sm text-red-600 mt-1 ${className}`}>
      {message}
    </p>
  );
};

export default InputError;
