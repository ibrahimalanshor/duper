const { body } = require('express-validator')
const { validator } = require('../../../../helpers')
const { checkAdminExistsByUsername } = require('../../../admin/validator')

const rules = [
  body('username')
    .exists()
    .withMessage('Username Required')
    .bail()
    .custom(checkAdminExistsByUsername),
  body('password').exists().withMessage('Password Required'),
]

module.exports = [rules, validator]
