const { body, param } = require('express-validator')
const { validator } = require('../../../helpers')
const { checkAdminUniqueByUsername } = require('../validator')

const params = [
  param('id')
    .exists()
    .withMessage('ID Required')
    .bail()
    .isMongoId()
    .withMessage('ID Must Mongo ID')
    .bail(),
]

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
    .custom((val, { req }) =>
      checkAdminUniqueByUsername(val, {
        unique: true,
        uniqueId: req.params.id,
      })
    ),
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

module.exports = [
  [params, validator],
  [rules, validator],
]
