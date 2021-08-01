import React from "react";
import { BrowserHead } from "../components/BrowserHead";
import { Navbar } from "../components/Navbar";
import { withApollo } from "../utils/withApollo";

const Index = () => {
  return (
    <div>
      <BrowserHead />
      <Navbar />
      <div>hello world</div>
    </div>
  );
};

export default withApollo({ ssr: true })(Index);
