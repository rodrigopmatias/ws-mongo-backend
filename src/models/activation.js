import { Schema } from 'mongoose';

export default (app) => {
  const { mongoose } = app.conf;

  const ActivationSchema = new Schema({
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    usedAt: Date,
  });

  return mongoose.model('Activation', ActivationSchema);
};
