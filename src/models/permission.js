import { Schema } from 'mongoose';

export default (app) => {
  const { mongoose } = app.conf;

  const permissionSchema = new Schema({
    name: {
      type: String,
      required: true,
    },
    codename: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
  });

  permissionSchema.index(['name', 'codename'], { unique: true });

  permissionSchema.statics.register = async (name, codename) => {
    const { Permission } = app.models;
    const exists = await Permission.countDocuments({ name, codename }) > 0;

    if (!exists) {
      return Permission.create({ name, codename });
    }

    return null;
  };

  return mongoose.model('Permission', permissionSchema);
};
