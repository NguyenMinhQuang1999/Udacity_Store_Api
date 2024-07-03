import express, { Request, Response } from 'express';
import { Order, OrderStore } from '../models/order';
import { verifyAuthToken } from './verifyAuthToken';

const orderStore = new OrderStore();

const index = async (_req: Request, res: Response) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const orders = await orderStore.findAll();
    res.json(orders);
  } catch (error) {
    throw error;
  }
};

const show = async (req: Request, res: Response) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const order = await orderStore.findOne(req.params.id);
    res.json(order);
  } catch (error) {
    throw error;
  }
};

const findOrderByUser = async (req: Request, res: Response) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const { user } = req.body;
    const user_id = user.id;
    const order = await orderStore.findOrderByUser(user_id);
    res.json(order);
  } catch (error) {
    throw error;
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const order: Order = {
      user_id: req.body.user_id,
      products: req.body.products,
      status: req.body.status
    };

    const newProduct = await orderStore.create(order);
    res.json(newProduct);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const completedOrder = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.body;
    const order: Order = await orderStore.completedOrder(user_id);
    res.json(order);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const destroy = async (req: Request, res: Response) => {
  const deleted = await orderStore.delete(req.params.id);
  res.json(deleted);
};

const productRoutes = (app: express.Application) => {
  app.get('/orders', verifyAuthToken, index);
  app.get('/orders/:id', verifyAuthToken, show);
  app.get('/orderByUser', verifyAuthToken, findOrderByUser);
  app.put('/completedOrder', verifyAuthToken, completedOrder);
  app.post('/orders', verifyAuthToken, create);
  app.delete('/orders/:id', verifyAuthToken, destroy);
};

export default productRoutes;
