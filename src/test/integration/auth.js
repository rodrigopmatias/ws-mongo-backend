import {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  UNAUTHORIZED,
} from 'http-status-codes';

describe('Router: /auth', () => {
  describe('Auto register: /auth/register', () => {
    before((done) => {
      app.models.User.deleteMany({})
        .then(() => done())
        .catch(err => done(err));
    });

    after((done) => {
      app.models.User.deleteMany({})
        .then(() => done())
        .catch(err => done(err));
    });

    it('Should bad password', (done) => {
      request.post('/auth/register')
        .send({
          email: 'user@test.com',
          firstName: 'User',
          lastName: 'of Test',
          password: 'secret',
          confirmPassword: 'secr3t',
        })
        .expect(BAD_REQUEST)
        .end((err, res) => {
          expect(res.body.ok).to.be.eql(false);
          done(err);
        });
    });


    it('Should create first user active and as admin', (done) => {
      request.post('/auth/register')
        .send({
          email: 'admin@test.com',
          firstName: 'Admin',
          lastName: 'of Test',
          password: 'secr3t',
          confirmPassword: 'secr3t',
        })
        .expect(CREATED)
        .end((err, res) => {
          expect(res.body.ok).to.be.eql(true);
          expect(res.body).to.have.property('user');
          expect(res.body.user.isActive).to.be.eql(true);
          expect(res.body.user.isAdmin).to.be.eql(true);
          done(err);
        });
    });


    it('Should user already exists', (done) => {
      request.post('/auth/register')
        .send({
          email: 'admin@test.com',
          firstName: 'Admin',
          lastName: 'of Test',
          password: 'secr3t',
          confirmPassword: 'secr3t',
        })
        .expect(BAD_REQUEST)
        .end((err, res) => {
          expect(res.body.ok).to.be.eql(false);
          done(err);
        });
    });


    it('Should create user inactive', (done) => {
      request.post('/auth/register')
        .send({
          email: 'user@test.com',
          firstName: 'User',
          lastName: 'of Test',
          password: 'secr3t',
          confirmPassword: 'secr3t',
        })
        .expect(CREATED)
        .end((err, res) => {
          expect(res.body.ok).to.be.eql(true);
          expect(res.body).to.have.property('user');
          expect(res.body.user.isActive).to.be.eql(false);
          expect(res.body.user.isAdmin).to.be.eql(false);
          done(err);
        });
    });
  });

  describe('Request activation: /auth/request-activation', () => {
    const { User, Activation } = app.models;

    before((done) => {
      User.deleteMany({})
        .then(() => Activation.deleteMany({}))
        .then(() => User.create({ email: 'user@test.com' }))
        .then(() => User.create({ email: 'active@test.com', isActive: true }))
        .then(() => done())
        .catch(err => done(err));
    });

    after((done) => {
      User.deleteMany({})
        .then(() => Activation.deleteMany({}))
        .then(() => done())
        .catch(err => done(err));
    });

    it('Should return user not found', (done) => {
      request.post('/auth/request-activation')
        .send({ email: 'usernotfound@test.com' })
        .expect(NOT_FOUND)
        .end((err, res) => {
          expect(res.body.ok).to.be.eql(false);
          done(err);
        });
    });

    it('Should return user already activated', (done) => {
      request.post('/auth/request-activation')
        .send({ email: 'active@test.com' })
        .expect(BAD_REQUEST)
        .end((err, res) => {
          expect(res.body.ok).to.be.eql(false);
          done(err);
        });
    });

    it('Should return activate token', (done) => {
      request.post('/auth/request-activation')
        .send({ email: 'user@test.com' })
        .expect(CREATED)
        .end((err, res) => {
          expect(res.body.ok).to.be.eql(true);
          done(err);
        });
    });
  });

  describe('Activate user with token: /auth/activate', () => {
    const { User, Activation } = app.models;
    let tokenValid;
    let tokenUsed;
    let tokenExpired;
    let user;

    before((done) => {
      User.deleteMany({})
        .then(() => Activation.deleteMany({}))
        .then(() => User.create({ email: 'user@mail.com', isActive: false }))
        .then((instance) => {
          user = instance;
        })
        .then(() => user.requestActivation())
        .then((act) => {
          act.usedAt = new Date();
          tokenUsed = act.token;
          return act.save();
        })
        .then(() => user.requestActivation())
        .then((act) => {
          act.expireAt = new Date(0);
          tokenExpired = act.token;
          return act.save();
        })
        .then(() => user.requestActivation())
        .then((act) => {
          tokenValid = act.token;
          return act.save();
        })
        .then(() => done())
        .catch(err => done(err));
    });
    after((done) => {
      User.deleteMany({})
        .then(() => Activation.deleteMany({}))
        .then(() => done())
        .catch(err => done(err));
    });

    it('Should activate token already used: /auth/activate?token={tokenUsed}', (done) => {
      request.get(`/auth/activate?token=${encodeURI(tokenUsed)}`)
        .expect(BAD_REQUEST)
        .end((err, res) => {
          expect(res.body.ok).to.be.eql(false);
          done(err);
        });
    });

    it('Should activate token already expired: /auth/activate?token={tokenExpired}', (done) => {
      request.get(`/auth/activate?token=${encodeURI(tokenExpired)}`)
        .expect(BAD_REQUEST)
        .end((err, res) => {
          expect(res.body.ok).to.be.eql(false);
          done(err);
        });
    });

    it('Should activate user: /auth/activate?token={tokenValid}', (done) => {
      request.get(`/auth/activate?token=${encodeURI(tokenValid)}`)
        .expect(OK)
        .end((err, res) => {
          expect(res.body.ok).to.be.eql(true);
          done(err);
        });
    });
  });

  describe('User authentication: /auth/authenticate', () => {
    const { User } = app.models;
    const password = 'secr3t';
    const badUser = {
      email: 'baduser@mail.com',
      firstName: 'Bad',
      lastName: 'User',
      isActive: false,
      isAdmin: false,
    };
    const goodUser = {
      email: 'gooduser@mail.com',
      firstName: 'Good',
      lastName: 'User',
      isActive: true,
      isAdmin: false,
    };

    before((done) => {
      User.deleteMany({})
        .then(() => User.create(goodUser))
        .then((user) => {
          user.setPassword(password)
            .then(() => user.save());
        })
        .then(() => User.create(badUser))
        .then((user) => {
          user.setPassword(password)
            .then(() => user.save());
        })
        .then(() => done())
        .catch(err => done(err));
    });

    after((done) => {
      User.deleteMany({})
        .then(() => done())
        .catch(err => done(err));
    });

    it('Should user or password not match (user not found)', (done) => {
      request.post('/auth/authenticate')
        .send({
          email: 'notfound@mail.com',
          password: 'anypassword',
        })
        .end((err, res) => {
          expect(res.status).to.be.eql(UNAUTHORIZED);
          done(err);
        });
    });

    it('Should user or password not match (bad password)', (done) => {
      request.post('/auth/authenticate')
        .send({
          email: goodUser.email,
          password: 'badpassword',
        })
        .end((err, res) => {
          expect(res.status).to.be.eql(UNAUTHORIZED);
          done(err);
        });
    });

    it('Should user is not activated', (done) => {
      request.post('/auth/authenticate')
        .send({
          email: badUser.email,
          password,
        })
        .end((err, res) => {
          expect(res.status).to.be.eql(UNAUTHORIZED);
          done(err);
        });
    });

    it('Should user token authentication', (done) => {
      request.post('/auth/authenticate')
        .send({
          email: goodUser.email,
          password,
        })
        .end((err, res) => {
          expect(res.status).to.be.eql(OK);
          expect(res.body).to.have.property('token');
          done(err);
        });
    });
  });
});
