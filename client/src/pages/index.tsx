import React from "react";
import { BrowserHead } from "../components/BrowserHead";
import { DarkModeSwitch } from "../components/DarkModeSwitch";

const Index = () => {
  return (
    <div>
      <BrowserHead />
      <div>hello world</div>
      <DarkModeSwitch />
    </div>
  );
};

export default Index;
