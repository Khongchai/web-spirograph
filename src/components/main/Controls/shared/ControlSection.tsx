import React, { PropsWithChildren, ReactNode } from "react";
import ControlContainer from "./ControlContainer";
import Heading from "./heading";

const ControlSection: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <section>{children}</section>;
};

export default ControlSection;
