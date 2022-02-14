const { model } = require('mongoose')

const AdminSchema = require('./admin.schema')

module.exports = model('Admin', AdminSchema)
