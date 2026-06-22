import React from 'react';
import type { FC } from 'react';

interface ScorecardContainerProps {
  id: string;
  children: React.ReactNode; 
}
const ScorecardContainer: FC<ScorecardContainerProps> = ({ id, children }) => {
  return (
    <div id={id} className="flex flex-col items-center justify-center space-x-4 p-2 m-3 max-sm:m-3 rounded-lg bg-blue-800 border border-yellow-600">
      {children}
    </div>
  )
}

export default ScorecardContainer;
