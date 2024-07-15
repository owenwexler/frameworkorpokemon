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
    <ScorecardContainer>
      <div className="flex flex-row items-center justify-center space-x-4">
        <p className={`${baseTextClasses} text-white`}>{capitalize(status as string)}: </p>
        <p className={`${baseTextClasses} ${status === 'correct' ? 'text-green-700' : 'text-red-700'}`}>{num}</p>
      </div>
    </ScorecardContainer>
  )
}

export default Scorecard;