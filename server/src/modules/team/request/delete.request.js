const { body, param } = require('express-validator')
const { validator } = require('../../../helpers')
const { checkTeamUniqueByName } = require('../validator')

const params = [
  param('id')
    .exists()
    .withMessage('ID Required')
    .bail()
    .isMongoId()
    .withMessage('ID Must Be MongoID'),
]

module.exports = [params, validator]
