import { Schema } from 'mongoose';

export default (app) => {
  const { mongoose } = app.conf;
  const groupSchema = new Schema({
    name: {
      type: String,
      required: true,
      unique: true,
    },
  });

  groupSchema.virtual('permissions').get(async function () {
    const { GroupPermission, Permission } = mongoose.models;
    const idset = (await GroupPermission.find({ groupId: this._id }).select('permissionId'))
      .map(data => data.permissionId);
    return Permission.find({ _id: { $in: idset } });
  });

  groupSchema.methods.addPermission = function (permissionId) {
    const { GroupPermission } = mongoose.models;
    return GroupPermission.create({ groupId: this._id, permissionId });
  };

  groupSchema.methods.removePermission = function (permissionId) {
    const { GroupPermission } = mongoose.models;
    return GroupPermission.deleteOne({ groupId: this._id, permissionId });
  };

  groupSchema.methods.clearPermissions = function () {
    const { GroupPermission } = mongoose.models;
    return GroupPermission.deleteMany({ groupId: this._id });
  };

  return mongoose.model('Group', groupSchema);
};
