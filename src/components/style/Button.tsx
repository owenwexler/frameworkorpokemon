import { children } from 'solid-js';

import type { Component } from 'solid-js';

interface ButtonProps {
  id: string;
  onClick: () => void;
  children: any; // @ts-ignore TODO: figure out the type for children in Solid
}

export const Button: Component<ButtonProps> = (props) => {
  const { id, onClick } = props;
  const c = children(() => props.children);

  const handleClick = () => {
    onClick();
  }

  return (
    <button
      id={id}
      class="bg-blue-600 rounded-lg border border-double border-yellow-600 p-9 text-white active:scale-95 transition-transform duration-[8ms]"
      onClick={handleClick}
    >
      {c()}
    </button>
  )
}