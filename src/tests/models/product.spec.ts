import { Product, ProductStore } from '../../models/products';

describe('Create Product', () => {
  const product: Product = {
    name: 'BMW',
    price: '2000000',
    category: 'Car'
  };

  const store = new ProductStore();

  describe('Product Model', () => {
    it('should have an index method', () => {
      expect(store.index).toBeDefined();
    });

    it('should have a show method', () => {
      expect(store.show).toBeDefined();
    });

    it('should have a create method', () => {
      expect(store.create).toBeDefined();
    });

    it('should have a update method', () => {
      expect(store.update).toBeDefined();
    });

    it('should have a delete method', () => {
      expect(store.delete).toBeDefined();
    });

    it('create method should add a product', async () => {
      const result = await store.create(product);
      console.log('product', result);
      expect(result).toEqual({
        id: 3,
        name: 'BMW',
        price: '2000000',
        category: 'Car'
      });
    });

    it('index method should return a list of product', async () => {
      const result = await store.index();
      console.log('index', result);

      expect(result).toEqual([
        {
          id: 3,
          name: 'BMW',
          price: '2000000',
          category: 'Car'
        }
      ]);
    });

    it('show method should return the correct products', async () => {
      const result = await store.show('3');
      expect(result).toEqual({
        id: 3,
        name: 'BMW',
        price: '2000000',
        category: 'Car'
      });
    });

    it('delete method should remove the producct', async () => {
      store.delete('3');
      const result = await store.index();

      expect(result).toEqual([]);
    });
  });
});
