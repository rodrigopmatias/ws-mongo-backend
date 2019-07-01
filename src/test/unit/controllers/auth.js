import {
  OK,
  BAD_REQUEST,
  CREATED,
  NOT_FOUND,
} from 'http-status-codes';

describe('Unit: AuthController', () => {
  describe('Register user: register', () => {
    it('Should password no match', (done) => {
      const { AuthController } = app.controllers;
      const userData = {
        email: 'auth@test.com',
        firstName: 'User',
        lastName: 'Auth',
        password: 'secret',
        confirmPassword: 'secr3t',
      };

      AuthController.register(userData)
        .then((res) => {
          expect(res.status).to.be.eql(BAD_REQUEST);
          expect(res.result.ok).to.be.eql(false);
          expect(res.result).to.have.property('message');
          done();
        })
        .catch(err => done(err));
    });

    it('Should register first user activated and with admin permissions', (done) => {
      const { AuthController } = app.controllers;
      const userData = {
        email: 'admin@test.com',
        firstName: 'Admin',
        lastName: 'User',
      };
      const userObj = {
        ...userData,
        isActive: true,
        isAdmin: true,
        _id: 'anyid',
        setPassword: td.func(),
        save: td.func(),
      };

      const UserModel = td.object();

      td.when(userObj.setPassword('secr3t')).thenResolve(true);
      td.when(UserModel.countDocuments({})).thenResolve(0);
      td.when(UserModel.countDocuments({ email: userData.email })).thenResolve(0);
      td.when(UserModel.create({ ...userData, isActive: true, isAdmin: true }))
        .thenResolve(userObj);

      AuthController.$Model = UserModel;
      AuthController.register({ ...userData, password: 'secr3t', confirmPassword: 'secr3t' })
        .then((res) => {
          expect(res.status).to.be.eql(CREATED);
          expect(res.result.ok).to.be.eql(true);
          expect(res.result.user.isActive).to.be.eql(true);
          expect(res.result.user.isAdmin).to.be.eql(true);
          done();
        })
        .catch(err => done(err));
    });

    it('Should register other user inactivate and without admin permissions', (done) => {
      const { AuthController } = app.controllers;
      const userData = {
        email: 'admin@test.com',
        firstName: 'Admin',
        lastName: 'User',
      };
      const userObj = {
        ...userData,
        isActive: false,
        isAdmin: false,
        _id: 'anyid',
        setPassword: td.func(),
        save: td.func(),
      };

      const UserModel = td.object();

      td.when(UserModel.countDocuments({})).thenResolve(1);
      td.when(UserModel.countDocuments({ email: userData.email })).thenResolve(0);
      td.when(UserModel.create({ ...userData, isActive: false, isAdmin: false }))
        .thenResolve(userObj);

      td.when(UserModel.setPassword('secr3t')).thenResolve(false);

      AuthController.$Model = UserModel;
      AuthController.register({ ...userData, password: 'secr3t', confirmPassword: 'secr3t' })
        .then((res) => {
          expect(res.status).to.be.eql(CREATED);
          expect(res.result.ok).to.be.eql(true);
          expect(res.result.user.isActive).to.be.eql(false);
          expect(res.result.user.isAdmin).to.be.eql(false);
          done();
        })
        .catch(err => done(err));
    });

    it('Should user already exists', (done) => {
      const { AuthController } = app.controllers;
      const userData = {
        email: 'admin@test.com',
        firstName: 'Admin',
        lastName: 'User',
      };
      const UserModel = td.object();

      td.when(UserModel.countDocuments({})).thenResolve(2);
      td.when(UserModel.countDocuments({ email: userData.email })).thenResolve(1);

      AuthController.$Model = UserModel;
      AuthController.register({ ...userData, password: 'secr3t', confirmPassword: 'secr3t' })
        .then((res) => {
          expect(res.status).to.be.eql(BAD_REQUEST);
          expect(res.result.ok).to.be.eql(false);
          expect(res.result).to.have.property('message');
          done();
        })
        .catch(err => done(err));
    });
  });

  describe('Request activation token: requestActivation', () => {
    it('Should return user not found', (done) => {
      const { AuthController } = app.controllers;
      const email = 'user@test.com';
      const UserModel = td.object();
      const userObj = null;

      td.when(UserModel.findOne({ email })).thenResolve(userObj);

      AuthController.$Model = UserModel;
      AuthController.requestActivation(email)
        .then((res) => {
          expect(res.status).to.be.eql(NOT_FOUND);
          done();
        })
        .catch(err => done(err));
    });

    it('Should return user already activated', (done) => {
      const { AuthController } = app.controllers;
      const email = 'user@test.com';
      const UserModel = td.object();
      const userObj = { _id: 'anyid', isActive: true };

      td.when(UserModel.findOne({ email })).thenResolve(userObj);

      AuthController.$Model = UserModel;
      AuthController.requestActivation(email)
        .then((res) => {
          expect(res.status).to.be.eql(BAD_REQUEST);
          expect(res.result).to.have.property('message');
          done();
        })
        .catch(err => done(err));
    });

    it('Should return activate token', (done) => {
      const { AuthController } = app.controllers;
      const email = 'user@test.com';
      const UserModel = td.object();
      const userObj = {
        _id: 'anyid',
        isActive: false,
        requestActivation: td.func(),
      };

      td.when(UserModel.findOne({ email })).thenResolve(userObj);
      td.when(userObj.requestActivation()).thenResolve({ token: 'anytoken' });

      AuthController.$Model = UserModel;
      AuthController.requestActivation(email)
        .then((res) => {
          expect(res.status).to.be.eql(CREATED);
          done();
        })
        .catch(err => done(err));
    });
  });

  describe('Activate user: activate', () => {
    it('Should activation token not found', (done) => {
      const { AuthController } = app.controllers;
      const ActivationMock = td.object();
      const token = 'not-found-token';

      td.when(ActivationMock.countDocuments({ token })).thenResolve(0);

      AuthController.$Activation = ActivationMock;
      AuthController.activate(token)
        .then((obj) => {
          expect(obj.status).to.be.eql(NOT_FOUND);
          expect(obj.result.ok).to.be.eql(false);
          done();
        })
        .catch(err => done(err));
    });

    it('Should activation token already used', (done) => {
      const { AuthController } = app.controllers;
      const ActivationMock = td.object();
      const token = 'used-token';

      td.when(ActivationMock.countDocuments({ token })).thenResolve(1);
      td.when(ActivationMock.findOne({ token })).thenResolve({
        usedAt: new Date(),
      });

      AuthController.$Activation = ActivationMock;
      AuthController.activate(token)
        .then((obj) => {
          expect(obj.status).to.be.eql(BAD_REQUEST);
          expect(obj.result.ok).to.be.eql(false);
          done();
        })
        .catch(err => done(err));
    });

    it('Should activation token already expired', (done) => {
      const { AuthController } = app.controllers;
      const ActivationMock = td.object();
      const token = 'expired-token';

      td.when(ActivationMock.countDocuments({ token })).thenResolve(1);
      td.when(ActivationMock.findOne({ token })).thenResolve({
        usedAt: null,
        expireAt: new Date(0),
      });

      AuthController.$Activation = ActivationMock;
      AuthController.activate(token)
        .then((obj) => {
          expect(obj.status).to.be.eql(BAD_REQUEST);
          expect(obj.result.ok).to.be.eql(false);
          done();
        })
        .catch(err => done(err));
    });

    it('Should user activated with sucess', (done) => {
      const { AuthController } = app.controllers;
      const ActivationMock = td.object();
      const UserMock = td.object();
      const token = 'valid-token';

      td.when(ActivationMock.countDocuments({ token })).thenResolve(1);
      td.when(ActivationMock.findOne({ token })).thenResolve({
        userId: 'user-id',
        usedAt: null,
        expiredAt: null,
      });
      td.when(UserMock.updateOne({ _id: 'user-id', isActive: true })).thenResolve({
        n: 1,
        nModified: 1,
      });

      AuthController.$Model = UserMock;
      AuthController.$Activation = ActivationMock;
      AuthController.activate(token)
        .then((obj) => {
          expect(obj.status).to.be.eql(OK);
          expect(obj.result.ok).to.be.eql(true);
          done();
        })
        .catch(err => done(err));
    });
  });

  describe('Request authentication token: authenticate', () => {
    it('Should user or password not match', (done) => {
      done();
    });

    it('Should user is not activated', (done) => {
      done();
    });

    it('Should user token authentication', (done) => {
      done();
    });
  });

  describe('Get user information from token: status', () => {
    it('Should user not authenticated', (done) => {
      done();
    });

    it('Should user informations', (done) => {
      done();
    });
  });
});
