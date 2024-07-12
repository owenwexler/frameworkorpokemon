import type { FunctionComponent } from 'preact';
import ButtonText from './ButtonText';

interface NextButtonProps {
  onClick: () => void;
}
const NextButton: FunctionComponent<NextButtonProps> = ({ onClick }) => {
  const handleClick = () => {
    onClick();
  }

  return (
    <button
      id="next-button"
      className="bg-blue-600 rounded-lg border border-double border-yellow-600 p-4 px-16 text-white active:scale-95 transition-transform duration-[8ms]"
      onClick={handleClick}
    >
      <ButtonText text="NEXT >>>" />
    </button>
  )
}

export default NextButton;