import React from 'react';

// Sports-agnostic logo: abstract "B" with dynamic athlete silhouette
export default function BrekoutLogo({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle */}
      <circle cx="20" cy="20" r="20" fill="url(#logoGrad)" />
      {/* Star/athlete silhouette - abstract rising athlete */}
      <path
        d="M20 8 L22.5 15 L30 15 L24 19.5 L26.5 27 L20 22.5 L13.5 27 L16 19.5 L10 15 L17.5 15 Z"
        fill="white"
        opacity="0.95"
      />
      {/* Upward arrow - "breaking out" */}
      <path
        d="M20 28 L20 34 M17 31 L20 28 L23 31"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#5B21B6" />
        </linearGradient>
      </defs>
    </svg>
  );
}
