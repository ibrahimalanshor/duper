const { body, param } = require('express-validator')
const { validator } = require('../../../helpers')
const {
  checkEmployeeUniqueByName,
  checkEmployeeUniqueByEmail,
} = require('../validator')

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
  body('name')
    .exists()
    .withMessage('Name Required')
    .bail()
    .notEmpty()
    .withMessage('Name Required')
    .bail()
    .isAlpha('en-US', { ignore: ' ' })
    .withMessage('Name Must Be String')
    .bail()
    .custom((val, { req }) =>
      checkEmployeeUniqueByName(val, {
        unique: true,
        uniqueId: req.params.id,
      })
    ),
  body('email')
    .exists()
    .withMessage('Email Required')
    .bail()
    .isEmail()
    .withMessage('Email Must Be Email')
    .bail()
    .custom((val, { req }) =>
      checkEmployeeUniqueByEmail(val, {
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
  body('phone')
    .exists()
    .withMessage('Phone Required')
    .bail()
    .isNumeric()
    .withMessage('Phone Must Be Numeric')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Phone Must Be Min 6'),
  body('address')
    .optional()
    .notEmpty()
    .withMessage('Address Required')
    .bail()
    .isString()
    .withMessage('Address Must Be String'),
  body('gender')
    .exists()
    .withMessage('Gender Required')
    .bail()
    .isIn(['male', 'female'])
    .withMessage('Gender Must Be Male or Female')
    .bail(),
  body('position')
    .exists()
    .withMessage('Position Required')
    .bail()
    .notEmpty()
    .withMessage('Poisition Required')
    .bail()
    .isAlpha('en-US', { ignore: ' &' })
    .withMessage('Position Must Be String')
    .bail(),
]

module.exports = [
  [params, validator],
  [rules, validator],
]
