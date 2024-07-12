import type { FunctionComponent } from "preact";
import type { Item } from "../../../typedefs/Item";
import { getIsAText } from "../../helper/getIsAText";

interface AnswerStatusSignProps {
  currentItem: Item;
  status: 'correct' | 'wrong';

}
const AnswerStatusSign: FunctionComponent<AnswerStatusSignProps> = ({ currentItem, status }) => {
  const baseDivClasses = 'flex flex-col items-center justify-center text-center px-6 py-6 max-sm:py-2 m-3 rounded-lg border border-blue-600';

  const divClasses = status === 'correct' ? `${baseDivClasses} bg-green-700` : `${baseDivClasses} bg-red-700`;

  return (
    <div className={divClasses}>
      <p className="text-lg text-white font-bold">{status === 'wrong' ? 'Wrong answer!' : 'Correct!'} {getIsAText(currentItem)}.</p>
    </div>
  )
}

export default AnswerStatusSign;