import { toPercentage } from "../helper/toPercentage";

import type { FunctionComponent } from "preact";
import Scorecard from "./style/Scorecard";
import ScorecardContainer from "./style/ScorecardContainer";


interface ScoreboardProps {
  numCorrect: number;
  numWrong: number;
  numTotal: number;
}

const Scoreboard: FunctionComponent<ScoreboardProps> = ({ numCorrect, numWrong, numTotal }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-1 max-sm:space-y-0">
      <div className="flex flex-row items-center justify-around">
        <Scorecard
          status="correct"
          num={numCorrect}
        />
        <Scorecard
          status="wrong"
          num={numWrong}
        />
      </div>
      {
        numTotal > 0
        ?
          <ScorecardContainer>
            <p className="text-2xl max-sm:text-lg text-white">% right: {toPercentage(numCorrect / numTotal)}</p>
          </ScorecardContainer>
        :
          null
      }
    </div>
  )
}

export default Scoreboard