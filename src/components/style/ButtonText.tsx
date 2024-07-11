import React from 'react';

interface ButtonTextProps {
  text: string;
}


const ButtonText: React.FC<ButtonTextProps> = ({ text }) => {
  return (
    <h1 className="text-2xl text-white font-bold">
      {text}
    </h1>
  )
}

export default ButtonText