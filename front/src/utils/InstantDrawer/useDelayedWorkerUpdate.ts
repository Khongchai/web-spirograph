import { useContext, useEffect, useRef, useState } from "react";
import { Rerender } from "../../contexts/rerenderToggle";

// Test that when the rerender context changes, the callback gets called.
export function useDelayedCallback(
  callback: VoidFunction,
  delayInMilliseconds: number,
  callbackDependencies: any[]
) {
  let timeoutRef = useRef<any>();

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      callback();
    }, delayInMilliseconds);
  }, [...callbackDependencies]);
}
