import { Schema } from 'mongoose';

export default dbs => {
  const UserSchema = new Schema({
    email: {
      type: String,
      required: true,
      index: true,
      unique: true
    },
    firstName: String,
    lastName: String,
    isActive: {
      type: Boolean,
      default: false
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  });
  return dbs.model('User', UserSchema);
}