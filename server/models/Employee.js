import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model('Employee', employeeSchema);
