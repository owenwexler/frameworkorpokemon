import type { FunctionComponent } from "preact";

interface NameSignProps {
  name: string;
}

const NameSign: FunctionComponent<NameSignProps> = ({ name }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center max-w-full py-6 max-sm:py-4 px-16 rounded-lg bg-yellow-600 border border-blue-600">
      <p className="text-3xl text-white font-bold">{name}</p>
    </div>
  )
}

export default NameSign;