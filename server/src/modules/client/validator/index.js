const ClientModel = require('../model')

module.exports = {
  checkClientExists: async (val, { withStatus = false, status = true } = {}) =>
    ClientModel.exists({
      _id: val,
      ...(withStatus ? { status } : {}),
    }).then(exists => {
      if (!exists) {
        return Promise.reject('Client Does Not Exists')
      }
    }),
  checkClientUniqueByName: async (
    val,
    { unique = false, uniqueId = null } = {}
  ) =>
    ClientModel.exists({
      name: val,
      ...(unique ? { _id: { $ne: uniqueId } } : {}),
    }).then(exists => {
      if (exists) {
        return Promise.reject('Client Already Exist')
      }
    }),
  checkClientUniqueByEmail: async (
    val,
    { unique = false, uniqueId = null } = {}
  ) =>
    ClientModel.exists({
      email: val,
      ...(unique ? { _id: { $ne: uniqueId } } : {}),
    }).then(exists => {
      if (exists) {
        return Promise.reject('Client Already Exist')
      }
    }),
}
