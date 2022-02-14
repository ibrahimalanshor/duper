const { Schema } = require('mongoose')

const TaskSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  label: {
    type: String,
  },
  estimate: {
    type: Date,
    required: true,
  },
  worker: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
})

module.exports = TaskSchema
