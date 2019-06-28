import { Schema } from 'mongoose';
import crypto from 'crypto';

export default (app) => {
  const { mongoose, security } = app.conf;

  const UserSchema = new Schema({
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    firstName: String,
    lastName: String,
    password: String,
    isActive: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  });

  /* eslint func-names: off */
  UserSchema.methods.matchPassword = function (plain) {
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
  UserSchema.methods.setPassword = function (plain) {
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

  return mongoose.model('User', UserSchema);
};
