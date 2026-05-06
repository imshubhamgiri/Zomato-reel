import React from 'react';

export default function Skeleton({ className = '', height = 'h-6', width = 'w-full' }) {
  return (
    <div
      className={`${height} ${width} ${className} bg-gray-300 dark:bg-gray-700 rounded animate-pulse`}
    />
  );
}
