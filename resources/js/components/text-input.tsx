import React, { forwardRef, useEffect, useRef } from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: string;
  className?: string;
  isFocused?: boolean;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ type = 'text', className = '', isFocused = false, ...props }, ref) => {
    const localRef = useRef<HTMLInputElement>(null);
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || localRef;

    useEffect(() => {
      if (isFocused && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isFocused, inputRef]);

    return (
      <input
        {...props}
        type={type}
        className={
          'border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-md shadow-sm ' +
          className
        }
        ref={inputRef}
      />
    );
  }
);

TextInput.displayName = 'TextInput';

export default TextInput;
