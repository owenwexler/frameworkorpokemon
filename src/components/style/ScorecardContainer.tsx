import type { FunctionComponent } from 'preact';

interface ScorecardContainerProps {
  children: any; // TODO: again, find out how Preact types child elements
}
const ScorecardContainer: FunctionComponent<ScorecardContainerProps> = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center space-x-4 p-2 m-3 max-sm:m-3 rounded-lg bg-blue-800 border border-yellow-600">
      {children}
    </div>
  )
}

export default ScorecardContainer;