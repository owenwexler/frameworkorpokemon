
import type { Item } from "../../typedefs/Item";
import { getRandomInt } from "../helper/getRandomInt";
import { Button } from "./style/Button";
import { getIsAText } from "../helper/getIsAText";
import { useEffect, useState } from "react";
import ButtonText from "./style/ButtonText";

interface QuizProps {
  data: Item[];
}


export const Quiz: React.FC<QuizProps> = ({ data }) => {
  const getRandomItem = () => {
    return data[getRandomInt(data.length)]
  }

  const [currentItem, setCurrentItem] = useState<Item>({ id: 0, name: '', type: 'framework' }); // this causes a bug where the data changes when the correct and wrong toasts are rendered and the wrong thing is shown in the toast.  TODO: fix this
  const [answerState, setAnswerState] = useState<'pending' | 'correct' | 'wrong'>('pending');
  const [numCorrect, setNumCorrect] = useState<number>(0);
  const [numWrong, setNumWrong] = useState<number>(0);
  const [numTotal, setNumTotal] = useState<number>(0);

  console.log('currentItem: ', currentItem);

  useEffect(() => {
    setCurrentItem(getRandomItem())
  }, [])

  const reset = () => {
    setAnswerState('pending');
    setCurrentItem(getRandomItem());
  }

  const correct = () => {
    setNumTotal(numTotal + 1);
    setNumCorrect(numCorrect + 1);
    setAnswerState('correct');
  }

  const wrong = () => {
    setNumTotal(numTotal + 1);
    setNumWrong(numWrong + 1);
    setAnswerState('wrong');
  }

  const guess = (answer: string) => {
    const item = currentItem;
    if (answer === item.type) {
      correct();
    } else {
      wrong();
    }
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center text-center p-6 m-5 rounded-lg bg-yellow-600 border border-blue-600">
        <p className="text-lg text-white font-bold">{currentItem.name}</p>
      </div>
      <div className="flex flex-row items-center justify-around p-5 space-x-6">
        <Button
          id="btn-framework"
          onClick={() => guess('framework')}
        >
          <ButtonText text="Framework" />
        </Button>

        <Button
          id="btn-framework"
          onClick={() => guess('pokemon')}
        >
          <ButtonText text="Pokemon" />
        </Button>
      </div>
      {
        answerState === 'correct'
        ?
        <div className="flex flex-col items-center justify-center text-center p-6 m-5 rounded-lg bg-green-700 border border-blue-600">
          <p className="text-lg text-white font-bold">Correct!  {getIsAText(currentItem)}.</p>
        </div>
        :
        null
      }
      {
        answerState === 'wrong'
        ?
        <div className="flex flex-col items-center justify-center text-center p-6 m-5 rounded-lg bg-red-700 border border-blue-600">
          <p className="text-lg text-white font-bold">Wrong answer!  {getIsAText(currentItem)}.</p>
        </div>
        :
        null
      }
      {
        answerState !== 'pending'
        ?
        <div className="flex flex-row items-center justify-center">
          <button
            id="next-button"
            className="bg-blue-600 rounded-lg border border-double border-yellow-600 p-4 px-16 text-white active:scale-95 transition-transform duration-[8ms]"
            onClick={() => reset()}
          >
            <ButtonText text="NEXT >>>" />
          </button>
        </div>
        :
        null
      }
    </>
  )
}

export default Quiz;