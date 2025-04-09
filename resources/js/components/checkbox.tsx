import React, { InputHTMLAttributes, useEffect, useRef } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  checked: boolean;
  className?: string;
  isFocused?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  className = '',
  isFocused = false,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <input
      {...props}
      type="checkbox"
      checked={checked}
      className={
        'rounded border-gray-300 text-red-600 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50 ' +
        className
      }
      ref={inputRef}
    />
  );
};

export default Checkbox;
