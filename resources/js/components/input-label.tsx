import React from 'react';

interface InputLabelProps {
  htmlFor: string;
  value?: string;
  className?: string;
  children?: React.ReactNode;
}

const InputLabel: React.FC<InputLabelProps> = ({ htmlFor, value, className = '', children }) => {
  return (
    <label htmlFor={htmlFor} className={`block font-medium text-sm text-gray-700 ` + className}>
      {value || children}
    </label>
  );
};

export default InputLabel;
