import { toPercentage } from "../helper/toPercentage";

import type { FunctionComponent } from "preact";


interface ScoreboardProps {
  numCorrect: number;
  numWrong: number;
  numTotal: number;
}

const Scoreboard: FunctionComponent<ScoreboardProps> = ({ numCorrect, numWrong, numTotal }) => {
  return (
    <div className="flex flex-col items-center justify-center space-x-4 p-2 m-5 rounded-lg bg-blue-800 border border-yellow-600">
      <div className="flex flex-row items-center justify-center space-x-4">
        <p className="text-3xl max-sm:text-2xl font-bold text-white">Correct: {numCorrect}</p>
        <p className="text-3xl max-sm:text-2xl font-bold text-white">Wrong: {numWrong}</p>
      </div>
      {
        numTotal > 0
        ?
          <p className="text-2xl max-sm:text-xl text-white mt-3">% right: {toPercentage(numCorrect / numTotal)}</p>
        :
          null
      }
    </div>
  )
}

export default Scoreboard