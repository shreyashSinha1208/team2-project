import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const courseSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  teacher: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  students: [
    {
      type: Types.ObjectId,
      ref: 'User',
    }
  ],
  published: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default model('Course', courseSchema);
