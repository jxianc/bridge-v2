import React from "react";
import { BrowserHead } from "../components/head/BrowserHead";
import { Layout } from "../components/common/Layout";
import { Posts } from "../components/homepage/Posts";
import { Navbar } from "../components/head/Navbar";
import { withApollo } from "../utils/withApollo";

const Index = () => {
  return (
    <div>
      <BrowserHead />
      <Navbar />
      <Posts />
    </div>
  );
};

export default withApollo({ ssr: true })(Index);
