// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Client from '../database';

export type ItemProduct = {
  product_id: number;
  quantity: number;
};
export type Order = {
  id?: string;
  user_id: number;
  status: string;
  products: ItemProduct[];
};

export class OrderStore {
  async findAll(): Promise<Order[]> {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders';

      const result = await conn.query(sql);

      const orders = [];
      for (let i = 0; i < result.rows.length; i++) {
        const { id } = result.rows[i];
        const productOrder = await conn.query(
          'SELECT product_id, quantity FROM order_products WHERE order_id=($1)',
          [id]
        );
        orders.push({
          ...result.rows[i],
          products: productOrder.rows
        });
      }

      conn.release();

      return orders;
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${err}`);
    }
  }

  async findOne(id: string): Promise<Order> {
    try {
      console.log(id, 'id');

      const sql = 'SELECT * FROM orders WHERE id=($1)';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);
      const productOrder = await conn.query(
        'SELECT product_id, quantity FROM order_products WHERE order_id=($1)',
        [result.rows[0].id]
      );

      conn.release();

      return { ...result.rows[0], products: productOrder.rows };
    } catch (err) {
      throw new Error(`Could not find Order ${id}. Error: ${err}`);
    }
  }

  async findOrderByUser(user_id: string): Promise<Order[]> {
    try {
      const sql = 'SELECT * FROM orders WHERE user_id=($1)';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [user_id]);

      const productOrder = await conn.query(
        'SELECT product_id, quantity FROM order_products WHERE order_id=($1)',
        [result.rows[0].id]
      );

      conn.release();

      return { ...result.rows[0], products: productOrder.rows };
    } catch (err) {
      throw new Error(`Could not find Order By User ${user_id}. Error: ${err}`);
    }
  }

  async create(order: Order): Promise<Order> {
    try {
      const { status, user_id, products } = order;

      console.log(JSON.stringify(order));

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await Client.connect();
      const sql =
        'INSERT INTO orders ( user_id, status) VALUES($1, $2) RETURNING *';
      const newOrder = await conn.query(sql, [user_id, status]);
      const result = newOrder.rows[0];

      const listProducts = [];
      for (let i = 0; i < products.length; i++) {
        const { product_id, quantity } = products[i];
        const { rows } = await conn.query(
          'INSERT INTO order_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING product_id, quantity',
          [result.id, product_id, quantity]
        );
        listProducts.push(rows[0]);
      }

      conn.release();

      console.log({ ...result, products: listProducts });

      return { ...result, products: listProducts };
    } catch (err) {
      throw new Error(`Can't create order (${order}): ${err}`);
    }
  }

  async completedOrder(user_id: string): Promise<Order> {
    const status: string = 'completed';
    try {
      const sql =
        'UPDATE orders SET status = $1 WHERE user_id = $2 RETURNING *';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await Client.connect();
      const { rows } = await conn.query(sql, [status, user_id]);
      conn.release();
      return rows[0];
    } catch (err) {
      throw new Error(`Could not update order by user ${user_id}. ${err}`);
    }
  }

  async delete(id: string): Promise<Order> {
    try {
      const sql = 'DELETE FROM orders WHERE id=($1)';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await Client.connect();
      await conn.query('DELETE FROM order_products WHERE order_id=($1)', [id]);

      const result = await conn.query(sql, [id]);

      const Order = result.rows[0];

      conn.release();

      return Order;
    } catch (err) {
      throw new Error(`Could not delete Order ${id}. Error: ${err}`);
    }
  }
}
