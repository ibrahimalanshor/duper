const { model } = require('mongoose')
const ProjectSchema = require('./project.schema')

module.exports = model('Project', ProjectSchema)
