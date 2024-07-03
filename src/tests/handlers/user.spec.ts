import supertest from 'supertest';
import jwt, { Secret } from 'jsonwebtoken';
import { User } from '../../models/user';
import app from '../../server';

const request = supertest(app);
const TOKEN_SECRET = process.env.TOKEN_SECRET as Secret;

describe('User Handler', () => {
  const userData: User = {
    firstName: 'Nguyen',
    lastName: 'Quang',
    userName: 'QuangNM',
    password: '123456'
  };

  let token: string,
    userId = 1;

  it('create user', async () => {
    const res = await request.post('/users').send(userData);

    const { body, status } = res;
    token = body;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { user } = jwt.verify(token, TOKEN_SECRET);
    userId = user.id;

    expect(status).toBe(200);
  });

  it('get list user', async () => {
    const res = await request
      .get('/users')
      .set('Authorization', 'Bearer ' + token);
    expect(res.status).toBe(200);
  });

  it('should get one user', async () => {
    const res = await request
      .get(`/users/${userId}`)
      .set('Authorization', 'Bearer ' + token);

    expect(res.status).toBe(200);
  });

  it('should get the authentication', async () => {
    const res = await request.post('/users/authenticate').send({
      userName: userData.userName,
      password: userData.password
    });

    expect(res.status).toBe(200);
  });

  it('should get the auth with wrong username', async () => {
    const res = await request
      .post('/users/authenticate')
      .send({
        userName: 'quangnmmmmm',
        password: userData.password
      })
      .set('Authorization', 'Bearer ' + token);

    expect(res.status).toBe(401);
  });

  it('should get the auth with wrong password', async () => {
    const res = await request
      .post('/users/authenticate')
      .send({
        userName: userData.userName,
        password: '1234455444'
      })
      .set('Authorization', 'Bearer ' + token);

    expect(res.status).toBe(401);
  });

  it('should get the delete user', async () => {
    const res = await request
      .delete(`/users/${userId}`)
      .set('Authorization', 'Bearer ' + token);
    expect(res.status).toBe(200);
  });
});
