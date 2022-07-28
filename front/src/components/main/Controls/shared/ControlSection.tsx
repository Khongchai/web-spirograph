import React, { PropsWithChildren, ReactNode } from "react";

const ControlSection: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <section>{children}</section>;
};

export default ControlSection;
