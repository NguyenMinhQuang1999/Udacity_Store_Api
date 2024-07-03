import jwt, { Secret } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { UserResponse } from '../models/user';
dotenv.config();

const TOKEN_SECRET = process.env.TOKEN_SECRET as Secret;
export const verifyAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const token = req.headers.authorization.split(' ')[1];
    const decode = jwt.verify(token, TOKEN_SECRET);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req.body.user = decode.user;

    next();
  } catch (error) {
    res.status(401);
    res.json('Access denied, invalid token');
    return;
  }
};

export const createToken = (user: UserResponse) => {
  try {
    return jwt.sign({ user }, TOKEN_SECRET);
  } catch (err) {
    return;
  }
};
