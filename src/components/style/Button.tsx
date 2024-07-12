import type { FunctionComponent } from 'preact';

interface ButtonProps {
  id: string;
  onClick: () => void;
  children: any; // TODO: find out what the Preact equivalent of React.ReactNode is
}

export const Button: FunctionComponent<ButtonProps> = ({ id, onClick, children }) => {
  const handleClick = () => {
    onClick();
  }

  return (
    <button
      id={id}
      className="bg-blue-600 rounded-lg border border-double border-yellow-600 py-2 w-48 max-sm:w-72 text-white max-sm:text-center active:scale-95 transition-transform duration-[8ms]"
      onClick={handleClick}
    >
      {children}
    </button>
  )
}