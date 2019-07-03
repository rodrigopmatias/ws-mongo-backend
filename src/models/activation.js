import crypto from 'crypto';
import { Schema } from 'mongoose';

export default (app) => {
  const { mongoose } = app.conf;

  const ActivationSchema = new Schema({
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    token: {
      type: String,
      unique: true,
    },
    usedAt: Date,
    expireAt: { type: Date },
  });

  ActivationSchema.pre('save', function (next) {
    if (!this.expireAt) {
      this.expireAt = new Date((new Date()).getTime() + (30 * 60 * 1000));
    }

    next();
  });

  ActivationSchema.pre('save', function (next) {
    const { security } = app.conf;
    if (!this.token) {
      crypto.randomBytes(256, (err, derivate) => {
        crypto.pbkdf2(derivate, security.secret, 1000, 512, security.hashPassword, (_err, dkey) => {
          this.token = dkey.toString('hex');
          next();
        });
      });
    } else {
      next();
    }
  });

  return mongoose.model('Activation', ActivationSchema);
};
