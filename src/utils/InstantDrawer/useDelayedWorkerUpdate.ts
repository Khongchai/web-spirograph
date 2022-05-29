import { useContext, useEffect, useRef, useState } from "react";
import { Rerender } from "../../contexts/rerenderToggle";

// Test that when the rerender context changes, the callback gets called.
export function useDelayedCallback(
  callback: VoidFunction,
  delayInMilliseconds: number
) {
  const rerender = useContext(Rerender);
  let timeoutRef = useRef<any>();

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      callback();
    }, delayInMilliseconds);
  }, [rerender]);
}
