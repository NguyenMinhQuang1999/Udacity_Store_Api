import { User, UserStore } from '../../models/user';

describe('Create User', () => {
  const user: User = {
    firstName: 'Nguyen',
    lastName: 'Quang',
    userName: 'QuangNM',
    password: '123456'
  };

  const store = new UserStore();

  describe('User Model', () => {
    it('should have an findAll method', () => {
      expect(store.findAll).toBeDefined();
    });

    it('should have a findOne method', () => {
      expect(store.findOne).toBeDefined();
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

    it('should have a authenticate method', () => {
      expect(store.authenticate).toBeDefined();
    });

    it('create method should add a user', async () => {
      const result = await store.create(user);
      expect(result).toEqual({
        id: 4,
        firstname: 'Nguyen',
        lastname: 'Quang',
        username: 'QuangNM'
      });
    });

    it('index method should return a list of user', async () => {
      const result = await store.findAll();
      expect(result).toEqual([
        {
          id: 4,
          firstname: 'Nguyen',
          lastname: 'Quang',
          username: 'QuangNM'
        }
      ]);
    });

    it('show method should return the correct user', async () => {
      const result = await store.findOne('4');
      expect(result).toEqual({
        id: 4,
        firstname: 'Nguyen',
        lastname: 'Quang',
        username: 'QuangNM'
      });
    });

    it('delete method should remove the user', async () => {
      await store.delete('4');
      const result = await store.findAll();
      console.log(result);

      expect(result).toEqual([]);
    });
  });
});
