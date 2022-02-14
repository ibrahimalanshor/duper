const { body } = require('express-validator')
const { validator } = require('../../../helpers')
const {
  checkClientUniqueByName,
  checkClientUniqueByEmail,
} = require('../validator')

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
    .custom(val => checkClientUniqueByName(val)),
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
    .custom(val => checkClientUniqueByEmail(val)),
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

module.exports = [rules, validator]
