import { factoryController } from '../helpers/controllers';

export default app => factoryController(app.models.Permission, 'PermissionController');
