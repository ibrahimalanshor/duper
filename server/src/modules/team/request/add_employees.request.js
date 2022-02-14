const { body, param } = require('express-validator')
const { Schema } = require('mongoose')
const { validator } = require('../../../helpers')
const { checkEmployeeUniqueInTeam } = require('../validator')
const { checkEmployeeExists } = require('../../employee/validator')

const params = [
  param('id')
    .exists()
    .withMessage('ID Required')
    .bail()
    .isMongoId()
    .withMessage('ID Must Be MongoID'),
]

const rules = [
  body('employee_id')
    .exists()
    .withMessage('EmployeesRequired')
    .bail()
    .isMongoId()
    .withMessage('Employee Must Be MongoID')
    .bail()
    .custom(val => checkEmployeeExists(val, { withStatus: true }))
    .bail()
    .custom((val, { req }) => checkEmployeeUniqueInTeam(val, req.params.id)),
]

module.exports = [
  [params, validator],
  [rules, validator],
]
