const { body, param } = require('express-validator')
const { validator } = require('../../../helpers')
const {
  checkClientUniqueByName,
  checkClientUniqueByEmail,
} = require('../validator')

const params = [
  param('id')
    .exists()
    .withMessage('ID required')
    .bail()
    .isMongoId()
    .withMessage('ID Must Be MongoID')
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
      checkClientUniqueByName(val, {
        unique: true,
        uniqueId: req.params.id,
      })
    ),
  body('address')
    .optional()
    .notEmpty()
    .withMessage('Address Required')
    .bail()
    .isString()
    .withMessage('Address Must Be String')
    .bail(),
  body('email')
    .exists()
    .withMessage('Email Required')
    .notEmpty()
    .withMessage('Email Required')
    .bail()
    .isEmail()
    .withMessage('Email Must Be Email')
    .bail()
    .custom((val, { req }) =>
      checkClientUniqueByEmail(val, {
        unique: true,
        uniqueId: req.params.id,
      })
    ),
  body('phone')
    .exists()
    .withMessage('Phone Required')
    .notEmpty()
    .withMessage('Phone Required')
    .bail()
    .isNumeric()
    .withMessage('Phone Must Be Numeric')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Phone Must Be Min 6')
    .bail(),
]

module.exports = [
  [params, validator],
  [rules, validator],
]
