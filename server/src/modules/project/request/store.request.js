const { body } = require('express-validator')
const { validator } = require('../../../helpers')
const { checkTeamExists } = require('../../team/validator')
const { checkProjectUniqueByName } = require('../validator')
const { checkClientExists } = require('../../client/validator')

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
    .custom(val => checkProjectUniqueByName(val)),
  body('description')
    .optional()
    .notEmpty()
    .withMessage('Description Required')
    .bail()
    .isString()
    .withMessage('Description Must Be String')
    .bail(),
  body('estimate')
    .optional()
    .isISO8601()
    .withMessage('Estimate Must Be Date')
    .bail()
    .isAfter()
    .withMessage('Estimate Must Be After Now')
    .bail(),
  body('budget')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Budget Must Be Numeric and Min 1')
    .bail(),
  body('team')
    .exists()
    .withMessage('Team Required')
    .bail()
    .isMongoId()
    .withMessage('Team Must Be MongoID')
    .bail()
    .custom(val => checkTeamExists(val, { withStatus: true })),
  body('client')
    .optional()
    .isMongoId()
    .withMessage('Client Must Be MongoID')
    .bail()
    .custom(val => checkClientExists(val, { withStatus: true })),
]

module.exports = [rules, validator]
