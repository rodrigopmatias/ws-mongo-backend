import {
  OK,
  BAD_REQUEST,
  CREATED,
  NOT_FOUND,
  NO_CONTENT,
} from 'http-status-codes';

export const responseDispatch = (res, result) => res.status(result.status).send(result);

export const defaultResponse = (data, status = OK, ok = true) => ({
  result: {
    ...data,
    ok,
  },
  status,
});

export const errorResponse = (message, status = BAD_REQUEST) => defaultResponse(
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

  async findById(_id) {
    let result;

    try {
      const res = await this.Model.findById(_id);
      if (res) {
        result = defaultResponse({ instance: res }, OK);
      } else {
        result = errorResponse('not found', NOT_FOUND);
      }
    } catch (e) {
      result = errorResponse(e.toString());
    }

    return result;
  }

  async find(filters, sort, limit = 30, page = 0) {
    let result;

    try {
      const total = await this.Model.countDocuments(filters);
      const collection = await this.Model.find(filters)
        .sort(sort)
        .skip(page * limit)
        .limit(limit);

      result = defaultResponse({ collection, total, count: collection.length }, OK);
    } catch (e) {
      result = errorResponse(e.toString());
    }

    return result;
  }

  async update(_id, data) {
    let result;

    try {
      const res = await this.Model.updateOne({ _id }, data);
      if (res.nModified > 0) {
        result = defaultResponse({ updated: res.nModified }, OK);
      } else {
        result = errorResponse('item not found', NOT_FOUND);
      }
    } catch (e) {
      result = errorResponse(e.toString());
    }

    return result;
  }

  async destroy(_id) {
    let result;

    try {
      await this.Model.deleteOne({ _id });
      result = defaultResponse(null, NO_CONTENT);
    } catch (e) {
      result = errorResponse(e.toString(), NOT_FOUND);
    }

    return result;
  }

  async create(data) {
    let result;

    try {
      const instance = await this.Model.create(data);
      result = defaultResponse({ instance }, CREATED);
    } catch (e) {
      result = errorResponse(e.toString());
    }

    return result;
  }

  async get(id) {
    let result;

    try {
      const obj = await this.Model.findById(id);
      result = defaultResponse(obj.toJSON(), OK);
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
