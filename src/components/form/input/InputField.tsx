import type React from "react";
import type { FC } from "react";

interface InputProps {
  type?: "text" | "number" | "email" | "password" | "date" | "time" | string;
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  min?: string;
  max?: string;
  step?: number;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  required?: boolean;
}

const Input: FC<InputProps> = ({
  type = "text",
  id,
  name,
  placeholder,
  value,
  onChange,
  className = "",
  min,
  max,
  step,
  disabled = false,
  success = false,
  error = false,
  hint,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  required = false,
}) => {
  // Generate hint ID for aria-describedby if hint exists and no custom aria-describedby is provided
  const hintId = hint && id ? `${id}-hint` : undefined;
  const describedBy = ariaDescribedBy || hintId;

  let inputClasses = ` h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-gray-400 ${className}`;

  if (disabled) {
    inputClasses += ` text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else if (error) {
    inputClasses += ` border-error-500 focus:ring-error-500 dark:text-error-400 dark:border-error-500`;
  } else if (success) {
    inputClasses += ` border-success-500 focus:ring-success-500 dark:text-success-400 dark:border-success-500`;
  } else {
    inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800`;
  }

  return (
    <div className="relative">
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        required={required}
        aria-describedby={describedBy}
        aria-invalid={ariaInvalid ?? error}
        className={inputClasses}
      />

      {hint && (
        <p
          id={hintId}
          className={`mt-1.5 text-xs ${
            error
              ? "text-error-500"
              : success
              ? "text-success-500"
              : "text-gray-600"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default Input;
