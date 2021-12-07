import { useState } from "react";

export default function useForceUpdate() {
  const [_, setState] = useState(0);
  return () => setState((value) => (value + 1) % 2);
}
