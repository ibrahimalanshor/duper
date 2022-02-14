const { model } = require('mongoose')

const TeamSchema = require('./team.schema')

module.exports = model('Team', TeamSchema)
