const { Schema } = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const { password } = require('../../../helpers')

const AdminSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true }
)

AdminSchema.plugin(mongoosePaginate)

AdminSchema.pre('save', async function () {
  const encryptedPassword = await password.encrpyt(this.password)

  this.password = encryptedPassword
})

AdminSchema.pre('updateOne', async function () {
  const encryptedPassword = await password.encrpyt(this.getUpdate().password)

  this.getUpdate().password = encryptedPassword
})

module.exports = AdminSchema
