import { Schema } from 'mongoose';

export default (app) => {
  const { mongoose } = app.conf;
  const groupPermissionSchema = new Schema({
    groupId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    permissionId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  });

  groupPermissionSchema.index(['groupId', 'permissionId'], { unique: true });

  return mongoose.model('GroupPermission', groupPermissionSchema);
};
