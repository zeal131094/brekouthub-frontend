import React from 'react';
import Spinner from './Spinner';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 active:scale-95 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

  const variants = {
    primary: 'bg-gradient-to-r from-primary to-primary-dark text-white hover:from-primary-light hover:to-primary hover:shadow-glow-purple focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-bg',
    secondary: 'bg-surface text-white border border-border hover:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-bg',
    accent: 'bg-gradient-to-r from-accent to-orange-600 text-white hover:from-accent-light hover:to-accent hover:shadow-glow-orange focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg',
    ghost: 'text-muted hover:text-white hover:bg-surface focus:ring-2 focus:ring-border focus:ring-offset-2 focus:ring-offset-bg',
    danger: 'bg-red-600/20 text-red-400 border border-red-600/30 hover:bg-red-600/30 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-bg',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-white focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-bg',
  };

  const sizes = {
    sm: 'text-sm py-2 px-4',
    md: 'text-sm py-3 px-6',
    lg: 'text-base py-3.5 px-8',
    xl: 'text-lg py-4 px-10',
    icon: 'p-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading ? <Spinner size="sm" color="white" /> : children}
    </button>
  );
}
