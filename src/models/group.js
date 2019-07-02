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

  return mongoose.model('Group', groupSchema);
};
