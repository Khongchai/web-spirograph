import { useCallback, useEffect } from "react";

/**
 * Convenient hook for adding and removing global pointer move listeners
 * based on the current pointer down state.
 */
export default function useGlobalPointerMove(
  setPointerDownState: (state: boolean) => void,
  pointerDownState: boolean,
  onPointerMove?: (event: PointerEvent) => void
) {
  const handlePointerMove = useCallback((e: PointerEvent) => {
    onPointerMove?.(e);
  }, []);

  const handleGlobalPointerUp = useCallback(() => {
    setPointerDownState(false);
  }, []);

  useEffect(() => {
    if (pointerDownState) {
      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", handleGlobalPointerUp);
    } else {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handleGlobalPointerUp);
    }
  }, [pointerDownState]);
}
