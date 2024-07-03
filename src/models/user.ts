// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Client from '../database';
import bcrypt from 'bcrypt';
const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = process.env.SALT_ROUNDS as unknown as string;

export type User = {
  id?: number;
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
};

export type UserResponse = {
  id?: number;
  firstname: string;
  lastname: string;
  username: string;
};

export class UserStore {
  async findAll(): Promise<UserResponse[]> {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await Client.connect();
      const sql = 'SELECT id, firstName, lastName, userName FROM users';

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`);
    }
  }

  async findOne(id: string): Promise<UserResponse> {
    try {
      const sql =
        'SELECT id, firstName, lastName, userName FROM users WHERE id=($1)';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find User ${id}. Error: ${err}`);
    }
  }

  async create(u: User): Promise<UserResponse> {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await Client.connect();
      const sql =
        'INSERT INTO users (firstName, lastName, userName, password) VALUES($1, $2, $3, $4) RETURNING *';

      const hash = bcrypt.hashSync(u.password + pepper, parseInt(saltRounds));

      const result = await conn.query(sql, [
        u.firstName,
        u.lastName,
        u.userName,
        hash
      ]);
      const user = result.rows[0];

      conn.release();
      delete user.password;

      return user;
    } catch (err) {
      throw new Error(`unable create user (${u.userName}): ${err}`);
    }
  }

  async update(id: number, user: User): Promise<UserResponse> {
    const { firstName, lastName } = user;

    try {
      const sql =
        'UPDATE users SET firstName = $1, lastName = $2 WHERE id = $4 RETURNING *';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await Client.connect();
      const { rows } = await conn.query(sql, [firstName, lastName, id]);
      conn.release();
      return rows[0];
    } catch (err) {
      throw new Error(`Could not update ${firstName}. ${err}`);
    }
  }

  async authenticate(
    userName: string,
    passWord: string
  ): Promise<UserResponse | null> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const conn = await Client.connect();
    const sql = 'SELECT * FROM users WHERE userName=($1)';

    const result = await conn.query(sql, [userName]);

    console.log(passWord + pepper);
    conn.release();

    if (result.rows.length) {
      const user = result.rows[0];

      if (bcrypt.compareSync(passWord + pepper, user.password)) {
        return user;
      }
    }

    return null;
  }

  async delete(id: string): Promise<UserResponse> {
    try {
      const sql = 'DELETE FROM users WHERE id=($1)';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      const User = result.rows[0];

      conn.release();

      return User;
    } catch (err) {
      throw new Error(`Could not delete User ${id}. Error: ${err}`);
    }
  }
}
