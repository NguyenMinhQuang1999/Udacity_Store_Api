import { ItemProduct, Order, OrderStore } from '../../models/order';

describe('Create Order', () => {
  const itemProduct: ItemProduct[] = [
    {
      product_id: 1,
      quantity: 1
    }
  ];
  const order: Order = {
    user_id: 1,
    status: 'active',
    products: itemProduct
  };

  const store = new OrderStore();

  describe('Order Model', () => {
    it('should have an findAll method', () => {
      expect(store.findAll).toBeDefined();
    });

    it('should have a findOne method', () => {
      expect(store.findOne).toBeDefined();
    });

    it('should have a findOrderByUser method', () => {
      expect(store.findOrderByUser).toBeDefined();
    });

    it('should have a create method', () => {
      expect(store.create).toBeDefined();
    });

    it('should have a completedOrder method', () => {
      expect(store.completedOrder).toBeDefined();
    });

    it('should have a delete method', () => {
      expect(store.delete).toBeDefined();
    });

    it('create method should add a order', async () => {
      const result = await store.create(order);
      expect(result).toEqual({
        id: '1',
        ...order
      });
    });

    it('index method should return a list of order', async () => {
      const result = await store.findAll();
      expect(result).toEqual([
        {
          id: '1',
          ...order
        }
      ]);
    });

    it('show method should return the correct order', async () => {
      const result = await store.findOne('1');
      expect(result).toEqual({
        id: '1',
        ...order
      });
    });

    it('findOrderByUser method should return the correct order', async () => {
      const result = await store.findOrderByUser('2');
      expect(result).toEqual([
        {
          id: '1',
          ...order
        }
      ]);
    });

    it('delete method should remove the order', async () => {
      store.delete('1');
      const result = await store.findAll();

      expect(result).toEqual([]);
    });
  });
});
