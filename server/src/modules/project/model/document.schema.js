const { Schema } = require('mongoose')
const { static_url } = require('../../../../config')

const DocumentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  file: {
    type: String,
    required: true,
  },
})

DocumentSchema.virtual('url').get(function () {
  return static_url + '/project/docs/' + this.file
})

DocumentSchema.set('toObject', { virtuals: true })
DocumentSchema.set('toJSON', { virtuals: true })

module.exports = DocumentSchema
