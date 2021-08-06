import React from "react";
import Head from "next/head";

interface HeadProps {
  title?: string;
}

export const BrowserHead: React.FC<HeadProps> = ({ title }) => {
  return (
    <Head>
      {!title ? <title>Bridge</title> : <title>Bridge - {title}</title>}
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
    </Head>
  );
};
