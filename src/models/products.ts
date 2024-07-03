// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Client from '../database';
export type Product = {
  id?: number;
  name: string;
  price: string;
  category: string;
};

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await Client.connect();
      const sql = 'SELECT * FROM products';

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get products. Error: ${err}`);
    }
  }

  async show(id: string): Promise<Product> {
    try {
      const sql = 'SELECT * FROM products WHERE id=($1)';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find Product ${id}. Error: ${err}`);
    }
  }

  async getProductByCategory(category: string): Promise<Product[]> {
    try {
      const sql = `SELECT * FROM products WHERE category ilike '%'||$1||'%'`;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [category]);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not find Product by ${category}. Error: ${err}`);
    }
  }

  async create(b: Product): Promise<Product> {
    try {
      const sql =
        'INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore

      const conn = await Client.connect();

      const result = await conn.query(sql, [b.name, b.price, b.category]);

      const Product = result.rows[0];

      conn.release();

      return Product;
    } catch (err) {
      throw new Error(`Could not add new Product ${b.name}. Error: ${err}`);
    }
  }

  async update(id: number, product: Product): Promise<Product> {
    const { name, price, category } = product;

    try {
      const sql =
        'UPDATE products SET name = $1, price = $2, category = $3 WHERE id = $4 RETURNING *';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await Client.connect();
      const { rows } = await conn.query(sql, [name, price, category, id]);
      conn.release();
      return rows[0];
    } catch (err) {
      throw new Error(`Could not update product ${name}. ${err}`);
    }
  }

  async delete(id: string): Promise<Product> {
    try {
      const sql = 'DELETE FROM products WHERE id=($1)';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      const Product = result.rows[0];

      conn.release();

      return Product;
    } catch (err) {
      throw new Error(`Could not delete Product ${id}. Error: ${err}`);
    }
  }
}
