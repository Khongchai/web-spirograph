import { useEffect, useState } from "react";

/*
    Ensures that the drag value is always refreshed when the value changes from outside
    while still providing the ability to update the state.
*/
export default function useStateEffect<T>(
  value: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  useEffect(() => {
    setDragValue(value);
  }, [value]);
  const [newValue, setDragValue] = useState(value);

  return [newValue, setDragValue];
}
