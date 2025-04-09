import React from 'react';

interface SecondaryButtonProps {
  type?: 'submit' | 'button' | 'reset';
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  type = 'button',
  className = '',
  disabled = false,
  onClick,
  children,
}) => {
  return (
    <button
      type={type}
      className={`inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50 disabled:opacity-25 transition ease-in-out duration-150 ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;
