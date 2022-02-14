const { body, param } = require('express-validator')
const { validator } = require('../../../../helpers')
const { checkBoardUniqueByName } = require('../../validator/board')

const params = [
  param('id')
    .exists()
    .withMessage('ID Required')
    .bail()
    .isMongoId()
    .withMessage('ID Must Be MongoID'),
  param('board_id')
    .exists()
    .withMessage('Board ID Required')
    .bail()
    .isMongoId()
    .withMessage('Board ID Must Be MongoID'),
  param('task_id')
    .exists()
    .withMessage('Task ID Required')
    .bail()
    .isMongoId()
    .withMessage('Task ID Must Be MongoID'),
]

module.exports = [params, validator]
