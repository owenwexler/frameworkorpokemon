import React from 'react';
import type { FC } from 'react';

interface ButtonProps {
  id: string;
  onClick: () => void;
  children: React.ReactNode; 
}

export const Button: FC<ButtonProps> = ({ id, onClick, children }) => {
  const handleClick = () => {
    onClick();
  }

  return (
    <button
      id={id}
      className="bg-blue-600 rounded-lg border border-double border-yellow-600 py-2 max-sm:py-1 w-48 max-sm:w-72 text-white max-sm:text-center active:scale-95 transition-transform duration-[8ms]"
      onClick={handleClick}
    >
      {children}
    </button>
  )
}
