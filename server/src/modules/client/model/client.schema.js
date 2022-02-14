const { Schema } = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const ClientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: String,
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

ClientSchema.plugin(mongoosePaginate)

module.exports = ClientSchema
