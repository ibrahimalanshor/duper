const { body } = require('express-validator')
const { validator } = require('../../../../helpers')
const { checkEmployeeExistsByEmail } = require('../../../employee/validator')

const rules = [
  body('email')
    .exists()
    .withMessage('Email Required')
    .bail()
    .isEmail()
    .withMessage('Email Must Be Email')
    .bail()
    .custom(checkEmployeeExistsByEmail),
  body('password').exists().withMessage('Password Required'),
]

module.exports = [rules, validator]
