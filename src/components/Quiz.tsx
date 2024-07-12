
import type { Item } from "../../typedefs/Item";
import { getRandomInt } from "../helper/getRandomInt";
import { Button } from "./style/Button";
import { getIsAText } from "../helper/getIsAText";
import { useEffect, useState } from 'preact/hooks';
import ButtonText from "./style/ButtonText";

import type { FunctionComponent } from 'preact';

interface QuizProps {
  data: Item[];
}


export const Quiz: FunctionComponent<QuizProps> = ({ data }) => {
  const getRandomItem = () => {
    return data[getRandomInt(data.length)]
  }

  const [currentItem, setCurrentItem] = useState<Item>({ id: 0, name: '', type: 'framework' });
  const [answerState, setAnswerState] = useState<'pending' | 'correct' | 'wrong'>('pending');
  const [numCorrect, setNumCorrect] = useState<number>(0);
  const [numWrong, setNumWrong] = useState<number>(0);
  const [numTotal, setNumTotal] = useState<number>(0);

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
    if (answerState !== 'pending') { return; }

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
        <p className="text-3xl text-white font-bold">{currentItem.name}</p>
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
      <div className="flex flex-row items-center justify-center space-x-4">
        <p className="text-3xl text-white">Correct: {numCorrect}</p>
        <p className="text-3xl text-white">Wrong: {numWrong}</p>
      </div>
      {
        numTotal > 0
        ?
        <div className="flex flex-row items-center justify-center space-x-4">
          <p className="text-2xl text-white">% right: {numCorrect / numTotal}%</p>
        </div>
        :
        null
      }
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