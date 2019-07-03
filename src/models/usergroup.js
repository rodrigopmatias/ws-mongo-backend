import { Schema } from 'mongoose';

export default (app) => {
  const { mongoose } = app.conf;
  const userGroupSchema = new Schema({
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    groupId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  });

  userGroupSchema.index(['userId', 'groupId'], { unique: true });

  return mongoose.model('UserGroup', userGroupSchema);
};
