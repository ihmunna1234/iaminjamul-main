interface StarDecorationProps {
  className?: string;
  filled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StarDecoration({ className = '', filled = true, size = 'md' }: StarDecorationProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <svg
      className={`${sizeClasses[size]} ${className}`}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 2}
    >
      <path d="M12 2L14.5 9.5H22L16.5 14L18.5 22L12 17.5L5.5 22L7.5 14L2 9.5H9.5L12 2Z" />
    </svg>
  );
}

export function FourPointStar({ className = '', filled = true, size = 'md' }: StarDecorationProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <svg
      className={`${sizeClasses[size]} ${className}`}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.5}
    >
      <path d="M12 0C12 0 14 10 12 12C10 14 0 12 0 12C0 12 10 10 12 12C14 10 24 12 24 12C24 12 14 14 12 12C10 10 12 0 12 0Z" />
    </svg>
  );
}
