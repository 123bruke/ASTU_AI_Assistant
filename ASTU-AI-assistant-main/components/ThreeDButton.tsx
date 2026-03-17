
import React from 'react';

interface ThreeDButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  active?: boolean;
  color?: 'blue' | 'white' | 'dark';
}

const ThreeDButton: React.FC<ThreeDButtonProps> = ({ 
  children, 
  onClick, 
  className = '', 
  active = false,
  color = 'blue'
}) => {
  const baseColor = color === 'blue' 
    ? 'bg-blue-600 text-white' 
    : color === 'white' 
      ? 'bg-white text-blue-600'
      : 'bg-gray-800 text-white';
    
  const shadowColor = color === 'blue'
    ? 'shadow-[0_4px_0_rgb(30,64,175)] hover:shadow-[0_6px_0_rgb(30,64,175)] active:shadow-none'
    : color === 'white'
      ? 'shadow-[0_4px_0_rgb(209,213,219)] hover:shadow-[0_6px_0_rgb(209,213,219)] active:shadow-none'
      : 'shadow-[0_4px_0_rgb(17,24,39)] hover:shadow-[0_6px_0_rgb(17,24,39)] active:shadow-none';

  return (
    <button
      onClick={onClick}
      className={`
        ${baseColor} 
        ${shadowColor}
        ${active ? 'translate-y-1 shadow-none' : ''}
        flex items-center justify-center p-3 rounded-xl 
        transition-all duration-150 transform active:translate-y-1
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default ThreeDButton;
