import { CREATED, BAD_REQUEST, OK, NOT_FOUND, NO_CONTENT } from 'http-status-codes';

describe('Unit: UserController', () => {
  const { UserController } = app.controllers;

  describe('Create user', () => {
    const data = {
      email: 'root@mail.com',
      firstName: 'Administrator',
      lastName: 'of System',
      isActive: true,
      isAdmin: true,
    };

    it('Should create one user with success', (done) => {
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
      UserController.$Model = td.object();
      td.when(UserController.$Model.create(data)).thenReject('any error message');

      UserController.create(data)
        .then((res) => {
          expect(res.status).to.be.eql(BAD_REQUEST);
          expect(res.result.ok).to.be.eql(false);
          expect(res.result).to.have.property('message');
          done();
        })
        .catch(err => done(err));
    });
  });

  describe('Update user', () => {
    const newData = {};

    it('Should update one user', (done) => {
      const myId = 'myId';

      UserController.$Model = td.object();
      td.when(UserController.$Model.updateOne(myId, newData)).thenResolve({
        n: 1,
        nModified: 1,
      });

      UserController.update(myId, newData)
        .then((res) => {
          expect(res.status).to.be.eql(OK);
          expect(res.result.ok).to.be.eql(true);
          expect(res.result.count).to.be.eql(1);
          done();
        })
        .catch(err => done(err));
    });

    it('Should user not found', (done) => {
      const myId = 'myId';

      UserController.$Model = td.object();
      td.when(UserController.$Model.updateOne(myId, newData)).thenResolve({
        n: 0,
        nModified: 0,
      });

      UserController.update(myId, newData)
        .then((res) => {
          expect(res.status).to.be.eql(NOT_FOUND);
          expect(res.result.ok).to.be.eql(false);
          expect(res.result).to.have.property('message');
          done();
        })
        .catch(err => done(err));
    });

    it('Should bad data for update user', (done) => {
      const myId = 'myId';

      UserController.$Model = td.object();
      td.when(UserController.$Model.updateOne(myId, newData)).thenReject('any message of backed');

      UserController.update(myId, newData)
        .then((res) => {
          expect(res.status).to.be.eql(BAD_REQUEST);
          expect(res.result.ok).to.be.eql(false);
          expect(res.result).to.have.property('message');
          done();
        })
        .catch(err => done(err));
    });
  });

  describe('Destroy user', () => {
    it('Should destroy one user', (done) => {
      const myId = 'myId';

      UserController.$Model = td.object();
      td.when(UserController.$Model.deleteOne(myId)).thenResolve();

      UserController.destroy(myId)
        .then((res) => {
          expect(res.status).to.be.eql(NO_CONTENT);
          expect(res.result.ok).to.be.eql(true);
          done();
        })
        .catch(err => done(err));
    });

    it('Should user not found', (done) => {
      const myId = 'myId';

      UserController.$Model = td.object();
      td.when(UserController.$Model.deleteOne(myId)).thenReject('any message');

      UserController.destroy(myId)
        .then((res) => {
          expect(res.status).to.be.eql(NOT_FOUND);
          expect(res.result.ok).to.be.eql(false);
          expect(res.result).to.have.property('message');
          done();
        })
        .catch(err => done(err));
    });
  });

  describe('Get users', () => {
    it('Should get one user', (done) => {
      const user = {
        _id: 'any id',
        email: 'root@mail.com',
        firstName: 'Administrator',
        lastName: 'of System',
        isActive: true,
        isAdmin: true,
      };

      UserController.$Model = td.object();
      td.when(UserController.$Model.findById('any id')).thenResolve(user);

      UserController.findById('any id')
        .then((res) => {
          expect(res.status).to.be.eql(OK);
          expect(res.result.ok).to.be.eql(true);
          expect(res.result).to.have.property('instance');
          done();
        })
        .catch(err => done(err));
    });

    it('Should user not found', (done) => {
      UserController.$Model = td.object();
      td.when(UserController.$Model.findById('any id')).thenReject('any message');

      UserController.findById('any id')
        .then((res) => {
          expect(res.status).to.be.eql(NOT_FOUND);
          expect(res.result.ok).to.be.eql(false);
          expect(res.result).to.have.property('message');
          done();
        })
        .catch(err => done(err));
    });

    it('Should get all users', (done) => {
      done();
    });

    it('Should filter and get users', (done) => {
      done();
    });
  });
});
