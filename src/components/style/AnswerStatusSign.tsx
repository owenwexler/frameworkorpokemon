import type { FC } from "react";
import { getIsAText } from "../../helper/getIsAText";
import type { Item } from "#/typedefs/Item";

interface AnswerStatusSignProps {
  currentItem: Item;
  status: 'correct' | 'wrong';

}
const AnswerStatusSign: FC<AnswerStatusSignProps> = ({ currentItem, status }) => {
  const baseDivClasses = 'flex flex-col items-center justify-center text-center px-6 py-6 max-sm:py-1 m-3 rounded-lg border border-blue-600';

  const divClasses = status === 'correct' ? `${baseDivClasses} bg-green-700` : `${baseDivClasses} bg-red-700`;

  return (
    <div id="answer-status-card" className={divClasses}>
      <p id="answer-status-text" className="text-lg max-sm:text-sm text-white font-bold">{status === 'wrong' ? 'Wrong answer!' : 'Correct!'} {getIsAText(currentItem)}.</p>
    </div>
  )
}

export default AnswerStatusSign;
