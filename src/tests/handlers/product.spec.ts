import supertest from 'supertest';
import jwt, { Secret } from 'jsonwebtoken';
import { Product } from '../../models/products';
import app from '../../server';
import { User } from '../../models/user';

const request = supertest(app);
const TOKEN_SECRET = process.env.TOKEN_SECRET as Secret;

let token: string, userId: number;

describe('Create Product', () => {
  const product: Product = {
    name: 'BMW',
    price: '2000000',
    category: 'Car'
  };

  beforeAll(async () => {
    const userData: User = {
      firstName: 'Nguyen',
      lastName: 'Quang',
      userName: 'QuangNM',
      password: '123456'
    };

    const { body } = await request.post('/users').send(userData);

    token = body;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { user } = jwt.verify(body, TOKEN_SECRET);
    userId = user.id;
  });

  afterAll(async () => {
    await request
      .delete(`/users/${userId}`)
      .set('Authorization', 'Bear ' + token);
    await request.delete(`/products/2`).set('Authorization', 'Bear ' + token);
  });

  it('gets list product', async () => {
    const res = await request.get('/products');
    expect(res.status).toBe(200);
  });

  it('create product', async () => {
    const res = await request
      .post('/products')
      .send(product)
      .set('Authorization', 'Bear ' + token);

    expect(res.status).toBe(200);
  });

  it('gets the product by id', async () => {
    const res = await request.get(`/products/1`);
    expect(res.status).toBe(200);
  });

  it('update product', async () => {
    const productUpdateData: Product = {
      ...product,
      name: 'Honda',
      price: '2000',
      category: 'Car New'
    };
    const res = await request
      .put(`/products/1`)
      .send(productUpdateData)
      .set('Authorization', 'Bear ' + token);

    expect(res.status).toBe(200);
  });

  it('delete product', async () => {
    const res = await request
      .delete(`/products/1`)
      .set('Authorization', 'Bear ' + token);
    expect(res.status).toBe(200);
  });

  it('product by category', async () => {
    const res = await request
      .get(`/getProductByCategory?category=Car`)
      .set('Authorization', 'Bear ' + token);
    expect(res.status).toBe(200);
  });
});
