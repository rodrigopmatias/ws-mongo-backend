import jwt from 'jwt-simple';
import {
  OK,
  BAD_REQUEST,
  CREATED,
  NOT_FOUND,
  UNAUTHORIZED,
} from 'http-status-codes';
import { errorResponse, defaultResponse } from '../helpers/controllers';

export class AuthController {
  constructor(Model, Activation, secConf) {
    this.$Model = Model;
    this.$Activation = Activation;
    this.$controllerName = 'AuthController';
    this.secConf = secConf;
  }

  get controllerName() {
    return this.$controllerName;
  }

  get Model() {
    return this.$Model;
  }

  async activate(token) {
    const found = (await this.$Activation.countDocuments({ token }) === 1);
    let obj;

    if (!found) {
      obj = errorResponse('activation token not found', NOT_FOUND);
    } else {
      const act = await this.$Activation.findOne({ token });

      if (act.usedAt) {
        obj = errorResponse('activation token already used', BAD_REQUEST);
      } else if (act.expireAt < new Date()) {
        obj = errorResponse('activation token already expired', BAD_REQUEST);
      } else {
        await this.$Model.updateOne({ _id: act.userId }, { isActive: true });
        obj = defaultResponse({}, OK);
      }
    }

    return obj;
  }

  async register(data) {
    const {
      email,
      firstName,
      lastName,
      password,
      confirmPassword,
    } = data;
    const isFirst = await this.Model.countDocuments({}) === 0;
    const alreadyExists = await this.Model.countDocuments({ email }) !== 0;
    const passwordMatch = password === confirmPassword;

    let res;

    if (alreadyExists) {
      res = errorResponse(`user already with email ${email} already exists.`, BAD_REQUEST);
    } else if (!passwordMatch) {
      res = errorResponse('password and confirm password not match.', BAD_REQUEST);
    } else {
      let user = await this.Model.create({
        email,
        firstName,
        lastName,
        isActive: isFirst,
        isAdmin: isFirst,
      });

      await user.setPassword(password);
      await user.save();

      user = await this.Model.findOne({ _id: user._id });

      res = defaultResponse({ user }, CREATED);
    }

    return res;
  }

  async requestActivation(email) {
    const user = await this.$Model.findOne({ email });
    let res;

    if (!user) {
      res = errorResponse('user not found', NOT_FOUND);
    } else if (!user.isActive) {
      await user.requestActivation();
      res = defaultResponse({}, CREATED);
    } else {
      res = errorResponse('user already activated', BAD_REQUEST);
    }

    return res;
  }

  async authenticate(email, password) {
    const user = await this.$Model.findOne({ email }).select(['password', 'isActive']);
    let res;

    if (user) {
      if (!user.isActive) {
        res = errorResponse('user is inactive', UNAUTHORIZED);
      } else if (!await user.matchPassword(password)) {
        res = errorResponse('user or password no match', UNAUTHORIZED);
      } else {
        res = defaultResponse({
          token: jwt.encode({ userId: user._id }, this.secConf.secret),
        }, OK);
      }
    } else {
      res = errorResponse('user or password no match', UNAUTHORIZED);
    }

    return res;
  }
}

export default app => new AuthController(app.models.User, app.models.Activation, app.conf.security);
