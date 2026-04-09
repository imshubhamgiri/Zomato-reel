import React from 'react';

export default function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  className = '',
}) {
  return (
    <div>
      {label ? (
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
          {label}
        </label>
      ) : null}
      <input
        type={type}
        value={value}
        onChange={onChange}  //{(e) => onChangeField('name', e.target.value)} - this is how it will be used in the parent component and onChange is actually setField from the useUserProfileForm hook
        placeholder={placeholder}
        className={`w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${className}`}
      />
    </div>
  );
}
