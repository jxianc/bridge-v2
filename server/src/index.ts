import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { CommentPointResolver } from "./resolver/CommentPointResolver";
import { CommentResolver } from "./resolver/CommentResolver";
import { PostCategoryResolver } from "./resolver/PostCategoryResolver";
import { PostPointResolver } from "./resolver/PostPointResolver";
import { PostResolver } from "./resolver/PostResolver";
import { UserResolver } from "./resolver/UserResolver";
import { createPostPointLoader } from "./utils/createPostPointLoader";
import { createUserLoader } from "./utils/createUserLoader";

require("dotenv").config();

const main = async () => {
  const app = express();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  const RedisStore = connectRedis(session);
  const redis = new Redis();
  app.use(
    session({
      name: process.env.SESSION_NAME,
      store: new RedisStore({ client: redis, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365, //1 years
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "development" ? false : true,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET as string,
      resave: false,
    })
  );

  await createConnection();

  const schema = await buildSchema({
    resolvers: [
      UserResolver,
      PostResolver,
      PostPointResolver,
      CommentResolver,
      CommentPointResolver,
      PostCategoryResolver,
    ],
  });
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),
      postPointLoader: createPostPointLoader(),
    }),
  });
  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(process.env.SERVER_PORT, () => {
    console.log(
      `Server is up and running at http://localhost:${process.env.SERVER_PORT}/graphql`
    );
  });
};

main();
