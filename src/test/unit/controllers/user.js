import { CREATED } from 'http-status-codes';

describe('Unit: UserController', () => {
  const { UserController } = app.controllers;

  describe('Create user', () => {
    it('Should create one user with success', (done) => {
      const data = {
        email: 'root@mail.com',
        firstName: 'Administrator',
        lastName: 'of System',
        isActive: true,
        isAdmin: true,
      };

      const user = {
        ...data,
        _id: 'any id',
      };

      UserController.$Model = td.object();
      td.when(UserController.$Model.create(data)).thenResolve(user);

      UserController.create(data)
        .then((res) => {
          expect(res.status).to.be.eql(CREATED);
          expect(res.result.ok).to.be.eql(true);
          expect(res.result).to.have.property('instance');
          done();
        })
        .catch(err => done(err));
    });

    it('Should user already exists', (done) => {
      done();
    });
  });

  describe('Update user', () => {
    it('Should update one user', (done) => {
      done();
    });

    it('Should user not found', (done) => {
      done();
    });

    it('Should bad data for update user', (done) => {
      done();
    });
  });

  describe('Destroy user', () => {
    it('Should destroy one user', (done) => {
      done();
    });

    it('Should user not found', (done) => {
      done();
    });
  });

  describe('Get users', () => {
    it('Should get one user', (done) => {
      done();
    });

    it('Should user not found', (done) => {
      done();
    });

    it('Should get all users', (done) => {
      done();
    });

    it('Should filter and get selected users', (done) => {
      done();
    });
  });
});
