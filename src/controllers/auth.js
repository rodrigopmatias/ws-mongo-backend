import { BAD_REQUEST, CREATED, NOT_FOUND } from 'http-status-codes';
import { errorResponse, defaultReponse } from '../helpers/controllers';

export class AuthController {
  constructor(Model) {
    this.$Model = Model;
    this.$controllerName = 'AuthController';
  }

  get controllerName() {
    return this.$controllerName;
  }

  get Model() {
    return this.$Model;
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
      const user = await this.Model.create({
        email,
        firstName,
        lastName,
        isActive: isFirst,
        isAdmin: isFirst,
      });

      await user.setPassword(password);
      await user.save();

      res = defaultReponse({ user }, CREATED);
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
      res = defaultReponse({}, CREATED);
    } else {
      res = errorResponse('user already activated', BAD_REQUEST);
    }

    return res;
  }
}

export default app => new AuthController(app.models.User);
