import type { FunctionComponent } from 'preact';
import { capitalize } from '../../helper/capitalize';
import ScorecardContainer from './ScorecardContainer';

interface ScorecardProps {
  status: 'correct' | 'wrong';
  num: number;
}

const Scorecard: FunctionComponent<ScorecardProps> = ({ status, num }) => {
  const baseTextClasses = 'text-2xl max-sm:text-lg font-bold';
  return (
    <ScorecardContainer id={`scorecard-container-${status}`}>
      <div id={`scorecard-status-${status}`} className="flex flex-row items-center justify-center space-x-4">
        <p id={`scorecard-status-text-${status}`} className={`${baseTextClasses} text-white`}>{capitalize(status as string)}: </p>
        <p id={`scorecard-status-number-${status}`} className={`${baseTextClasses} ${status === 'correct' ? 'text-green-700' : 'text-red-700'}`}>{num}</p>
      </div>
    </ScorecardContainer>
  )
}

export default Scorecard;