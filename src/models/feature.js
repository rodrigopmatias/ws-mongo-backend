import { Schema } from 'mongoose';

export default (app) => {
  const { mongoose } = app.conf;

  const featureSchema = new Schema({
    title: {
      type: String,
      required: true,
      index: true,
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
    resource: {
      type: String,
      required: false,
    },
    father: {
      type: Schema.Types.ObjectId,
      required: false,
    },
  });

  featureSchema.path('resource').validate(function (value) {
    if (!this.isGroup && (value === '' || value === null)) {
      return false;
    }

    return true;
  });

  return mongoose.model('Feature', featureSchema);
};
