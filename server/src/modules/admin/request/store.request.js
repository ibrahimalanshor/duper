const { body } = require('express-validator')
const { validator } = require('../../../helpers')
const { checkAdminUniqueByUsername } = require('../validator')

const rules = [
  body('username')
    .exists()
    .withMessage('Username Required')
    .bail()
    .notEmpty()
    .withMessage('Username Required')
    .bail()
    .isAlpha('en-US', { ignore: ' ' })
    .withMessage('Username Must Be String')
    .bail()
    .custom(val => checkAdminUniqueByUsername(val)),
  body('password')
    .exists()
    .withMessage('Password Required')
    .bail()
    .isAlphanumeric()
    .withMessage('Password Must Be Alphanumeric')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Password Must Be Min 8'),
]

module.exports = [rules, validator]
