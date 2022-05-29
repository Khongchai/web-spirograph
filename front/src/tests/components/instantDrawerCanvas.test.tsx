import { renderHook } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";
import { Rerender } from "../../contexts/rerenderToggle";
import { useDelayedCallback } from "../../utils/InstantDrawer/useDelayedWorkerUpdate";

//TODO
test("The callback passed to useDelayedCallback should be called after 300 milliseconds when rerender context is triggered", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Rerender.Provider value={false}>{children}</Rerender.Provider>
  );
  const { result } = renderHook(() => useDelayedCallback, { wrapper });

  act(() => {});
});

test("The callback passed to useDelayedCallback should be called after 300 seconds after the last rerender for successive calls", () => {});
