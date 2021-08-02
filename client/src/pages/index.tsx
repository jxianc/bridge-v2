import React from "react";
import { BrowserHead } from "../components/BrowserHead";
import { Layout } from "../components/homepage/Layout";
import { Navbar } from "../components/Navbar";
import { withApollo } from "../utils/withApollo";

const Index = () => {
  return (
    <div>
      <BrowserHead />
      <Navbar />
      <Layout />
    </div>
  );
};

export default withApollo({ ssr: true })(Index);
