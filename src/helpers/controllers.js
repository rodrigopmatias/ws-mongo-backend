import { OK, BAD_REQUEST, CREATED } from 'http-status-codes';

export const defaultReponse = (data, status = OK, ok = true) => ({
  result: {
    ...data,
    ok,
  },
  status,
});

export const errorResponse = (message, status = BAD_REQUEST) => defaultReponse(
  { message },
  status,
  false,
);

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
    let result;

    try {
      const instance = await this.Model.create(data);
      result = defaultReponse({ instance }, CREATED);
    } catch (e) {
      result = errorResponse(e.toString());
    }

    return result;
  }

  async get(id) {
    let result;

    try {
      const obj = await this.Model.findById(id);
      result = defaultReponse(obj.toJSON(), OK);
    } catch (e) {
      result = errorResponse(e.toString());
    }

    return result;
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
