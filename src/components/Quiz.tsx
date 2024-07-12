
import type { Item } from "../../typedefs/Item";
import { getRandomInt } from "../helper/getRandomInt";
import { Button } from "./style/Button";
import { getIsAText } from "../helper/getIsAText";
import { useEffect, useState } from 'preact/hooks';
import ButtonText from "./style/ButtonText";

import type { FunctionComponent } from 'preact';
import NameSign from "./style/NameSign";

import Scoreboard from "./Scoreboard";
import AnswerStatusSign from "./style/AnswerStatusSign";
import NextButton from "./style/NextButton";

interface QuizProps {
  data: Item[];
}

const Quiz: FunctionComponent<QuizProps> = ({ data }) => {
  const getRandomItem = () => {
    return data[getRandomInt(data.length)]
  }

  const [currentItem, setCurrentItem] = useState<Item>({ id: 0, name: '', type: 'framework' });
  const [answerState, setAnswerState] = useState<'pending' | 'correct' | 'wrong'>('pending');
  const [numCorrect, setNumCorrect] = useState<number>(0);
  const [numWrong, setNumWrong] = useState<number>(0);
  const [numTotal, setNumTotal] = useState<number>(0);

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

  useEffect(() => {
    setCurrentItem(getRandomItem())
  }, [])

  return (
    <>
      <NameSign name={currentItem.name} />

      <div className="flex flex-row max-sm:flex-col items-center text-center justify-around max-sm:justify-center p-5 space-x-6 max-sm:space-x-0 max-sm:space-y-4">
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

      <Scoreboard
        numCorrect={numCorrect}
        numWrong={numWrong}
        numTotal={numTotal}
      />

      {
        answerState === 'correct'
        ?
        <AnswerStatusSign
          currentItem={currentItem}
          status="correct"
        />
        :
        null
      }
      {
        answerState === 'wrong'
        ?
        <AnswerStatusSign
          currentItem={currentItem}
          status="wrong"
        />
        :
        null
      }
      {
        answerState !== 'pending'
        ?
        <div className="flex flex-row items-center justify-center">
          <NextButton
            onClick={() => reset()}
          />
        </div>
        :
        null
      }
    </>
  )
}

export default Quiz;