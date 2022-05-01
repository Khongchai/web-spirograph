import React from "react";
import Button from "../components/main/Shared/Button";

export default function Landing() {
  return (
    <div className=" select-none">
      <h1
        className="m-auto text-white w-min text-5xl font-bold"
        style={{ paddingTop: "114px" }}
      >
        Spiro
      </h1>
      <Button
        onClick={() => {
          console.log("TODO");
        }}
        additionalStyle={{
          color: "white",
          fontWeight: "bold",
          padding: "10px 50px",
          borderRadius: "7px",
          position: "absolute",
          left: "50%",
          top: "max(50%, 220px)",
          transform: "translateX(-50%) translateY(-50%)",
        }}
        buttonText="Begin"
      />
    </div>
  );
}
