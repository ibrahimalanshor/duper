const { isValidObjectId } = require('mongoose')

module.exports = {
  checkArrayOfMongoId: val => {
    console.log(val)
    if (!val.every(id => isValidObjectId(id)))
      throw new Error('Array Must Contains MongoID')

    return true
  },
}
