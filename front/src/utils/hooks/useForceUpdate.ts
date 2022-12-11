import { useState } from "react";

/**
 * Unlike the rerender toggle, this will only rerender that component.
 */
export default function useForceUpdate() {
  const [_, setState] = useState(0);
  return () => setState((value) => (value + 1) % 2);
}
