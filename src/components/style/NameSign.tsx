import type { FC } from "react";
import Spinner from "./Spinner";

interface NameSignProps {
  name: string;
}

const NameSign: FC<NameSignProps> = ({ name }) => {
  return (
    <div id="name-sign" className="flex flex-col items-center justify-center text-center max-w-full py-6 max-sm:py-2 px-16 rounded-lg bg-yellow-600 border border-blue-600">
      {
        name === ''
        ?
          <Spinner />
        :
          <p id="name-sign-text" className="text-3xl max-sm:text-xl text-white font-bold">{name}</p>
      }
    </div>
  )
}

export default NameSign;
