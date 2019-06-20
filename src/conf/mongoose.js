import mongoose from 'mongoose';

export default mongoose.createConnection(process.env.MONGO_URI || 'mongodb://localhost/db', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
