import React from "react";

const ContentContainer: React.FC = ({ children }) => {
  return (
    <div className="content-container" style={{ marginTop: "24.05px" }}>
      {children}
    </div>
  );
};

export default ContentContainer;
