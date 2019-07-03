import { Schema } from 'mongoose';
import crypto from 'crypto';

export default (app) => {
  const { mongoose, security } = app.conf;

  const userSchema = new Schema({
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    firstName: String,
    lastName: String,
    password: {
      type: String,
      select: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  });

  /**
   * Groups
   * */
  userSchema.virtual('groups').get(async function () {
    const { UserGroup, Group } = mongoose.models;
    const idset = (await UserGroup.find({ userId: this._id }).select('groupId'))
      .map(data => data.groupId);
    return Group.find({ _id: { $in: idset } });
  });

  userSchema.methods.addGroup = function (groupId) {
    const { UserGroup } = mongoose.models;
    return UserGroup.create({ userId: this._id, groupId });
  };

  userSchema.methods.removeGroup = function (groupId) {
    const { UserGroup } = mongoose.models;
    return UserGroup.deleteOne({ userId: this._id, groupId });
  };

  userSchema.methods.clearGroups = function () {
    const { UserGroup } = mongoose.models;
    return UserGroup.deleteMany({ userId: this._id });
  };

  /**
   * Permissions
   * */
  userSchema.virtual('permissions').get(async function () {
    const { UserPermission, Permission } = mongoose.models;
    const idset = (await UserPermission.find({ userId: this._id }).select('permissionId'))
      .map(data => data.permissionId);
    return Permission.find({ _id: { $in: idset } });
  });

  userSchema.methods.addPermission = function (permissionId) {
    const { UserPermission } = mongoose.models;
    return UserPermission.create({ userId: this._id, permissionId });
  };

  userSchema.methods.removePermission = function (permissionId) {
    const { UserPermission } = mongoose.models;
    return UserPermission.deleteOne({ userId: this._id, permissionId });
  };

  userSchema.methods.clearPermissions = function () {
    const { UserPermission } = mongoose.models;
    return UserPermission.deleteMany({ userId: this._id });
  };

  userSchema.methods.requestActivation = function () {
    const { Activation } = mongoose.models;
    return Activation.create({ userId: this._id });
  };

  /**
   * User methods
   * */
  userSchema.methods.hasPermission = async function (name, codename) {
    const { Permission } = mongoose.models;
    let permIdset;
    let flag = false;

    if (this.isActive && this.isAdmin) {
      flag = true;
    } else if (this.isActive) {
      permIdset = (await this.permissions).map(perm => perm._id);
      (await this.groups).forEach(async (group) => {
        permIdset = permIdset.concat((await group.permissions).map(perm => perm._id));
      });

      flag = (await Permission.countDocuments({ _id: { $in: permIdset }, name, codename })) > 0;
    }

    return flag;
  };

  userSchema.methods.permissionForModel = async function (name) {
    const { Permission } = mongoose.models;
    let permIdset;
    let rst = [];

    if (this.isActive && this.isAdmin) {
      rst = await Permission.find({ name });
    } else if (this.isActive) {
      permIdset = (await this.permissions).map(perm => perm._id);
      (await this.groups).forEach(async (group) => {
        permIdset = permIdset.concat((await group.permissions).map(perm => perm._id));
      });

      rst = await Permission.find({ _id: { $in: permIdset }, name });
    }

    return rst;
  };

  userSchema.methods.matchPassword = function (plain) {
    return new Promise(
      (resolve, reject) => {
        const { secret, hashPassword } = security;

        crypto.pbkdf2(plain, secret, 10000, 128, hashPassword, (err, derivedKey) => {
          if (err) {
            this.password = null;
            reject(err);
          } else {
            resolve(this.password === derivedKey.toString('base64'));
          }
        });
      },
    );
  };

  /* eslint func-names: off */
  userSchema.methods.setPassword = function (plain) {
    return new Promise(
      (resolve, reject) => {
        const { secret, hashPassword } = security;

        crypto.pbkdf2(plain, secret, 10000, 128, hashPassword, (err, derivedKey) => {
          if (err) {
            this.password = null;
            reject(err);
          } else {
            this.password = derivedKey.toString('base64');
            resolve(false);
          }
        });
      },
    );
  };

  return mongoose.model('User', userSchema);
};
