const { Schema } = require('mongoose')

const TaskSchema = require('./task.schema')

const BoardSchema = new Schema({
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
  status: {
    type: Boolean,
    default: false,
  },
  tasks: [TaskSchema],
})

module.exports = BoardSchema
