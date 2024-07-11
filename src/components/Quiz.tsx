import { createSignal, Show, type Component } from "solid-js";
import type { Item } from "../../typedefs/Item";
import { getRandomInt } from "../helper/getRandomInt";
import { Button } from "./style/Button";
import { getIsAText } from "../helper/getIsAText";

interface QuizProps {
  data: Item[];
}

export const Quiz: Component<QuizProps> = (props) => {
  const { data } = props;

  console.log(data);

  const [currentIndex, setCurrentIndex] = createSignal<number>(getRandomInt(data.length)); // this causes a bug where the data changes when the correct and wrong toasts are rendered and the wrong thing is shown in the toast.  TODO: fix this
  const [prevItem, setPrevItem] = createSignal({ id: 0, name: '', type: 'framework' }); // this is to address the above bug hopefully.  TODO: come up with a better way to address this bug.
  const [answerState, setAnswerState] = createSignal<'pending' | 'correct' | 'wrong'>('pending');
  const [numCorrect, setNumCorrect] = createSignal<number>(0);
  const [numWrong, setNumWrong] = createSignal<number>(0);
  const [numTotal, setNumTotal] = createSignal<number>(0);

  const index = currentIndex();
  const currentItem = data[index];

  console.log('currentItem: ', currentItem);
  console.log('prevItem: ', prevItem());

  const reset = () => {
    setAnswerState('pending');
    setCurrentIndex(getRandomInt(data.length));
  }

  const correct = () => {
    setPrevItem(currentItem);
    setNumTotal(numTotal() + 1);
    setNumCorrect(numCorrect() + 1);
    setAnswerState('correct');
  }

  const wrong = () => {
    setPrevItem(currentItem);
    setNumTotal(numTotal() + 1);
    setNumWrong(numWrong() + 1);
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
      <div class="flex flex-col items-center justify-center text-center p-6 m-5 rounded-lg bg-yellow-600 border border-blue-600">
        <p class="text-lg text-white font-bold">{currentItem.name}</p>
      </div>
      <div class="flex flex-row items-center justify-around p-5 space-x-6">
        <Button
          id="btn-framework"
          onClick={() => guess('framework')}
        >
          <h1 class="text-2xl text-white font-bold">
            Framework
          </h1>
        </Button>

        <Button
          id="btn-framework"
          onClick={() => guess('pokemon')}
        >
          <h1 class="text-2xl text-white font-bold">
            Pokemon
          </h1>
        </Button>
      </div>
      <Show when={answerState() === 'correct'}>
        <div class="flex flex-col items-center justify-center text-center p-6 m-5 rounded-lg bg-green-700 border border-blue-600">
          <p class="text-lg text-white font-bold">Correct!  {getIsAText(prevItem())}.</p>
        </div>
      </Show>
      <Show when={answerState() === 'wrong'}>
        <div class="flex flex-col items-center justify-center text-center p-6 m-5 rounded-lg bg-red-700 border border-blue-600">
          <p class="text-lg text-white font-bold">Wrong answer!  {getIsAText(prevItem())}.</p>
        </div>
      </Show>
    </>
  )
}

export default Quiz;