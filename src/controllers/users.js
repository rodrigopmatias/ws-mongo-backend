import { factoryController, ModelController } from '../helpers/controllers';

class UserController extends ModelController {
  constructor(Model) {
    super(Model,  'UserController');
  }
}

export default app => factoryController(app.models.User, 'UserController', UserController);