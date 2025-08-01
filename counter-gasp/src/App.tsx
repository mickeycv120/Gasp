import "./App.css";
import Counter from "./counter";
import { useState } from "react";

function App() {
  const [count, setCount] = useState(2);

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => Math.max(0, prev - 1));

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-5">
      <div className="flex flex-col items-center space-y-8">
        <Counter
          value={count}
          places={[100, 10, 1]}
          fontSize={120}
          padding={20}
          gap={8}
          textColor="white"
          fontWeight={900}
          borderRadius={16}
          horizontalPadding={24}
          gradientHeight={30}
          gradientFrom="rgba(15,23,42,0.9)"
          gradientTo="transparent"
          containerClassName=""
          counterClassName="bg-slate-800 border border-slate-700"
          digitClassName="border-slate-600 bg-slate-800/50"
          topGradientClassName=""
          bottomGradientClassName=""
        />

        <div className="flex space-x-4">
          <button
            onClick={decrement}
            className="w-16 h-16 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold transition-colors"
          >
            -
          </button>
          <button
            onClick={increment}
            className="w-16 h-16 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold transition-colors"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
