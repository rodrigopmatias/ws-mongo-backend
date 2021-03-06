import mongoose from 'mongoose';

let uri;
const opts = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

if (process.env.NODE_ENV === 'test') {
  uri = process.env.MONGO_URI_TEST || 'mongodb://localhost/db_test';
} else {
  uri = process.env.MONGO_URI || 'mongodb://localhost/db';
}

export default mongoose.createConnection(uri, opts);
