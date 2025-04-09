import React, { forwardRef, useEffect, useRef } from 'react';

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
  isFocused?: boolean;
  children: React.ReactNode;
}

const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  ({ className = '', isFocused = false, children, ...props }, ref) => {
    const localRef = useRef<HTMLSelectElement>(null);
    const selectRef = (ref as React.RefObject<HTMLSelectElement>) || localRef;

    useEffect(() => {
      if (isFocused && selectRef.current) {
        selectRef.current.focus();
      }
    }, [isFocused, selectRef]);

    return (
      <select
        {...props}
        className={
          'border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-md shadow-sm ' +
          className
        }
        ref={selectRef}
      >
        {children}
      </select>
    );
  }
);

SelectInput.displayName = 'SelectInput';

export default SelectInput;
