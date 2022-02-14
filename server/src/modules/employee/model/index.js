const { model } = require('mongoose')

const EmployeeSchema = require('./employee.schema')

module.exports = model('Employee', EmployeeSchema)
