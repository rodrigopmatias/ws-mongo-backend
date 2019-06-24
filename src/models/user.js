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
  UserSchema.methods.matchPassword = function () {

  }

  /* eslint func-names: off */
  UserSchema.methods.setPassword = function (plain) {
    const { secret } = security;

    crypto.pbkdf2(plain, secret, 10000, 128, 'sha224WithRSAEncryption', (err, derivedKey) => {
      if (err) {
        this.password = null;
      } else {
        this.password = derivedKey;
      }
    });
  };

  return mongoose.model('User', UserSchema);
};
