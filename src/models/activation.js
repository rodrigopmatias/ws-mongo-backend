import crypto from 'crypto';
import { Schema } from 'mongoose';

export default (app) => {
  const { mongoose } = app.conf;

  const ActivationSchema = new Schema({
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    token: String,
    usedAt: Date,
    expireAt: {
      type: Date,
      required: true,
    },
  });

  ActivationSchema.pre('save', function (next) {
    if (!this.token) {
      crypto.randomBytes(256, (err, derivate) => {
        this.token = derivate.toString('hex');
        next();
      });
    } else {
      next();
    }
  });

  return mongoose.model('Activation', ActivationSchema);
};
