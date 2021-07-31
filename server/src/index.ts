import express from "express";
import { createConnection } from "typeorm";

require("dotenv").config();

const main = async () => {
  const app = express();

  app.get("/", (_req, res) => {
    res.send("hello world");
  });

  await createConnection();

  app.listen(process.env.SERVER_PORT, () => {
    console.log(
      `Server is up and running at http://localhost:${process.env.SERVER_PORT}/graphql`
    );
  });
};

main();
