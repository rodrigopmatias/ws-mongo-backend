import { OK, BAD_REQUEST, CREATED } from 'http-status-codes';

const defaultReponse = (data, status = OK) => ({
  result: {
    ok: true,
    ...data,
  },
  status,
});

const errorResponse = (message, status = BAD_REQUEST) => ({
  result: {
    ok: false,
    message,
  },
  status,
});

export class ModelController {
  constructor(Model, name) {
    this.$name = name;
    this.$Model = Model;
  }

  get controllerName() {
    return this.$name;
  }

  get Model() {
    return this.$Model;
  }

  async create(data) {
    try {
      const obj = await this.Model.create(data);
      return defaultReponse(obj.toJSON(), CREATED);
    } catch (e) {
      return errorResponse(e.toString());
    }
  }

  async get(id) {
    try {
      const obj = await this.Model.findById(id);
      return defaultReponse(obj.toJSON(), OK);
    } catch (e) {
      return errorResponse(e.toString());
    }
  }
}

export const factoryController = (Model, name, ControllerBase) => {
  let obj;

  if (ControllerBase) {
    obj = new ControllerBase(Model, name);
  } else {
    obj = new ModelController(Model, name);
  }

  return obj;
};
