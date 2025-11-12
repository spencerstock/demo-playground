import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ children, className = '', onClick, hover = false }: CardProps) {
  const hoverClasses = hover ? 'hover:bg-gray-50 cursor-pointer transition-all duration-150' : '';

  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 p-4 ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
