import express, { Request, Response } from 'express';
import { Product, ProductStore } from '../models/products';
import { verifyAuthToken } from './verifyAuthToken';

const productStore = new ProductStore();

type QueryCategory = {
  category: string;
};

const index = async (_req: Request, res: Response) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const products = await productStore.index();
    res.json(products);
  } catch (error) {
    throw error;
  }
};

const show = async (req: Request, res: Response) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const article = await productStore.show(req.params.id);
    res.json(article);
  } catch (error) {
    throw error;
  }
};

const getProductByCategory = async (req: Request, res: Response) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const query = req.query as unknown as QueryCategory;
    const article = await productStore.getProductByCategory(query.category);
    res.json(article);
  } catch (error) {
    throw error;
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const product: Product = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category
    };

    const newProduct = await productStore.create(product);
    res.json(newProduct);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    const { name, price, category } = req.body;
    const product: Product = await productStore.update(id, {
      name,
      price,
      category
    });
    res.json(product);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const destroy = async (req: Request, res: Response) => {
  const deleted = await productStore.delete(req.params.id);
  res.json(deleted);
};

const productRoutes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.get('/getProductByCategory', getProductByCategory);
  app.put('/products/:id', verifyAuthToken, update);
  app.post('/products', verifyAuthToken, create);
  app.delete('/products/:id', verifyAuthToken, destroy);
};

export default productRoutes;
