import { ItemProduct } from './../../models/order';
import { Order } from '../../models/order';
import supertest from 'supertest';
import jwt, { Secret } from 'jsonwebtoken';

import { User } from '../../models/user';
import app from '../../server';
import { Product } from '../../models/products';
const request = supertest(app);
const TOKEN_SECRET = process.env.TOKEN_SECRET as Secret;

let token: string, userId: number;

describe('Create Order', () => {
  const itemProduct: ItemProduct[] = [
    {
      product_id: 1,
      quantity: 1
    }
  ];

  beforeAll(async () => {
    const userData: User = {
      firstName: 'Nguyen',
      lastName: 'Quang',
      userName: 'QuangNM',
      password: '123456'
    };
    const { body } = await request.post('/users').send(userData);

    token = body;
    console.log(token, 'token');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { user } = jwt.verify(body, TOKEN_SECRET);
    userId = user.id;

    const product: Product = {
      name: 'BMW',
      price: '2000000',
      category: 'Car'
    };
    await request
      .post('/products')
      .send(product)
      .set('Authorization', 'Bear ' + token);
  });

  afterAll(async () => {
    await request
      .delete(`/users/${userId}`)
      .set('Authorization', 'Bear ' + token);
  });

  const order: Order = {
    user_id: 1,
    status: 'active',
    products: itemProduct
  };

  it('gets list order', async () => {
    const res = await request
      .get('/orders')
      .set('Authorization', 'Bear ' + token);
    expect(res.status).toBe(200);
  });

  it('create order', async () => {
    const res = await request
      .post('/orders')
      .send(order)
      .set('Authorization', 'Bear ' + token);

    expect(res.status).toBe(200);
  });

  it('gets the order by id', async () => {
    const res = await request
      .get(`/orders/1`)
      .set('Authorization', 'Bear ' + token);
    expect(res.status).toBe(200);
  });

  it('get order by user', async () => {
    const res = await request
      .get(`/orderByUser`)
      .set('Authorization', 'Bear ' + token);
    expect(res.status).toBe(200);
  });

  it('delete order', async () => {
    const res = await request
      .delete(`/orders/1`)
      .set('Authorization', 'Bear ' + token);
    expect(res.status).toBe(200);
  });
});
