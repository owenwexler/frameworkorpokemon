import type { FunctionComponent } from 'preact';

interface ButtonTextProps {
  text: string;
}


const ButtonText: FunctionComponent<ButtonTextProps> = ({ text }) => {
  return (
    <h1 className="text-2xl text-white font-bold">
      {text}
    </h1>
  )
}

export default ButtonText