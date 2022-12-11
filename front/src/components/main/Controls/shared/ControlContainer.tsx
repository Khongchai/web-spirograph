import React, { ReactNode } from "react";

const SettingsContainer: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="content-container" style={{ marginTop: "24.05px" }}>
      {children}
    </div>
  );
};

export default SettingsContainer;
