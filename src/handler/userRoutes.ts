import express, { Request, Response } from 'express';
import { User, UserResponse, UserStore } from '../models/user';
import { createToken, verifyAuthToken } from './verifyAuthToken';

const userStore = new UserStore();

const index = async (_req: Request, res: Response) => {
  const users = await userStore.findAll();
  res.json(users);
};

const show = async (req: Request, res: Response) => {
  const user = await userStore.findOne(req.params.id);
  res.json(user);
};

const create = async (req: Request, res: Response) => {
  try {
    const user: User = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.userName,
      password: req.body.password
    };

    const newUser = await userStore.create(user);
    const token = createToken(newUser);

    res.json(token);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const destroy = async (req: Request, res: Response) => {
  const deleted = await userStore.delete(req.params.id);
  res.json(deleted);
};

const authenticate = async (req: Request, res: Response) => {
  try {
    const userName = (req.body.userName as unknown as string) || 'admin';
    const password = (req.body.password as unknown as string) || '123456';

    const user: UserResponse | null = await userStore.authenticate(
      userName,
      password
    );
    if (!user) {
      return res.status(401).send(`UserName or Password invalid.`);
    }
    res.json(createToken(user));
  } catch (err) {
    res.status(400).json(err);
  }
};

const productRoutes = (app: express.Application) => {
  app.get('/users', verifyAuthToken, index);
  app.get('/users/:id', verifyAuthToken, show);
  app.post('/users', create);
  app.delete('/users/:id', verifyAuthToken, destroy);
  app.post('/users/authenticate', authenticate);
};

export default productRoutes;
