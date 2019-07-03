import { Schema } from 'mongoose';

export default (app) => {
  const { mongoose } = app.conf;
  const userPermissionSchema = new Schema({
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    permissionId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  });

  userPermissionSchema.index(['userId', 'permissionId'], { unique: true });

  return mongoose.model('UserPermission', userPermissionSchema);
};
