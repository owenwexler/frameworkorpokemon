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
      className="bg-blue-600 rounded-lg border border-double border-yellow-600 p-9 text-white active:scale-95 transition-transform duration-[8ms]"
      onClick={handleClick}
    >
      {children}
    </button>
  )
}