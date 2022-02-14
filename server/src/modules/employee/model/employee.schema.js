const { Schema } = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const { password } = require('../../../helpers')

const EmployeeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female'],
    },
    position: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
)

EmployeeSchema.plugin(mongoosePaginate)

EmployeeSchema.pre('save', async function () {
  const encryptedPassword = await password.encrpyt(this.password)

  this.password = encryptedPassword
})

EmployeeSchema.pre('updateOne', async function () {
  if (this.getUpdate().password) {
    const encryptedPassword = await password.encrpyt(this.getUpdate().password)

    this.getUpdate().password = encryptedPassword
  }
})

module.exports = EmployeeSchema
