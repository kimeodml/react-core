import createElement from "@/utils/createElement";
import { useState, useEffect } from '@/hooks/myReact';

export default function Counter() {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    console.log('effect', counter);
  }, [counter]);

  return (
    <div className="container">
      <div>{counter}</div>
      <button type="button" onClick={() => setCounter((prev) => prev + 1)}>증가</button>
      <button type="button" onClick={() => setCounter((prev) => prev - 1)}>감소</button>
    </div>
  );
}