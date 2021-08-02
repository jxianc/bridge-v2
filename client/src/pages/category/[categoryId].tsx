import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { BrowserHead } from "../../components/BrowserHead";
import { PostsByCategory } from "../../components/categorypage/PostsByCategory";
import { Navbar } from "../../components/Navbar";
import { withApollo } from "../../utils/withApollo";

const Category: NextPage<{ categoryId: string }> = () => {
  const router = useRouter();
  const categoryId =
    typeof router.query.categoryId === "string" ? router.query.categoryId : "";
  if (!categoryId) {
    router.push("/");
  }

  return (
    <div>
      <BrowserHead />
      <Navbar />
      <PostsByCategory categoryId={parseInt(categoryId)} />
    </div>
  );
};

export default withApollo({ ssr: true })(Category);
