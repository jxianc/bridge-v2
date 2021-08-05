import { Request, Response } from "express";
import { Redis } from "ioredis";
import { createPostPointLoader } from "./utils/createPostPointLoader";
import { createUserLoader } from "./utils/createUserLoader";

export interface MyContext {
  req: Request;
  res: Response;
  redis: Redis;
  userLoader: ReturnType<typeof createUserLoader>;
  postPointLoader: ReturnType<typeof createPostPointLoader>;
}
