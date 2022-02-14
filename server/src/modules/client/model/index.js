const { model } = require('mongoose')

const ClientSchema = require('./client.schema')

module.exports = model('Client', ClientSchema)
