import React from "react";
import "./icon-button.css";

interface IconButtonProps {
  iconUrl: string;
  alt: string;
}

const IconButton: React.FC<IconButtonProps> = ({ iconUrl, alt }) => {
  return <img src={iconUrl} alt={alt} className="icon-button" />;
};

export default IconButton;
