const { Schema } = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const TeamSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    leader: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
    },
    employees: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
      },
    ],
  },
  { timestamps: true }
)

TeamSchema.plugin(mongoosePaginate)

module.exports = TeamSchema
