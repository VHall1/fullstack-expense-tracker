import { Request, Response } from "express";
import { RedisClient } from "redis";
import session from "express-session";

export type MyContext = {
  req: Request;
  res: Response;
  redis: RedisClient;
  session: session.Session & Partial<session.SessionData> & { userId: string };
};
