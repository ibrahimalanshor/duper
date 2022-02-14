const { Schema } = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const DocumentSchema = require('./document.schema')
const BoardSchema = require('./board.schema')

const ProjectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    estimate: {
      type: Date,
    },
    budget: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['active', 'finish', 'failed'],
      default: 'active',
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
    },
    documents: [DocumentSchema],
    boards: [BoardSchema],
  },
  { timestamps: true }
)

ProjectSchema.plugin(mongoosePaginate)

module.exports = ProjectSchema
