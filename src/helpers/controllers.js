import { OK, BAD_REQUEST, CREATED } from 'http-status-codes';

const defaultReponse = (data, status = OK) => ({
  result: {
    ok: true,
    ...data
  },
  status: status
});

const errorResponse = (message, status = BAD_REQUEST) => ({
  result: {
    ok: false,
    message
  },
  status,
});

export class ModelController {
  constructor(Model, name) {
    this._name = name;
    this._Model = Model;
  }

  get controllerName() {
    return this._name;
  }

  get Model() {
    return this._Model;
  }

  async create(data) {
    try {
      const obj = await this.Model.create(data);
      return defaultReponse(obj.toJSON(), CREATED);
    } catch(e) {
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
  if (ControllerBase) {
    return new ControllerBase(Model, name);
  } else {
    return new ModelController(Model, name);
  }
}