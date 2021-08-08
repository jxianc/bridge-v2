import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import path from "path";
import "dotenv-safe/config";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { COOKIE_NAME, __prod__ } from "./constants";
import { CommentPoint } from "./entities/CommentPoint";
import { Post } from "./entities/Post";
import { PostCategory } from "./entities/PostCategory";
import { PostPoint } from "./entities/PostPoint";
import { Comment } from "./entities/Comment";
import { User } from "./entities/User";
import { CommentPointResolver } from "./resolver/CommentPointResolver";
import { CommentResolver } from "./resolver/CommentResolver";
import { PostCategoryResolver } from "./resolver/PostCategoryResolver";
import { PostPointResolver } from "./resolver/PostPointResolver";
import { PostResolver } from "./resolver/PostResolver";
import { UserResolver } from "./resolver/UserResolver";
import { createUserLoader } from "./utils/createUserLoader";

const main = async () => {
  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );

  const conn = await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    logging: false,
    // synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [User, Post, Comment, PostPoint, CommentPoint, PostCategory],
  });
  await conn.runMigrations();

  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);
  app.set("trust proxy", 1);
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ client: redis, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365, //1 years
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__,
        domain: __prod__ ? ".bridgeapp.xyz" : undefined,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET as string,
      resave: false,
    })
  );

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
    }),
  });
  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(parseInt(process.env.PORT as string), () => {
    console.log(
      `Server is up and running at http://localhost:${process.env.PORT}/graphql`
    );
  });
};

main();
