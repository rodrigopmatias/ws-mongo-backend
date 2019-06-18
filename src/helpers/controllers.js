import { OK, BAD_REQUEST } from 'http-status-codes';

const defaultReponse = (data, status = OK) => ({
  json: {
    ok: true,
    data
  },
  status: status
});

const errorResponse = (message, status = BAD_REQUEST) => ({
  json: {
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
      return defaultReponse(obj.toJSON());
    } catch(e) {
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