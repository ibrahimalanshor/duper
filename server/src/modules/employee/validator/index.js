const EmployeeModel = require('../model')

module.exports = {
  checkEmployeeExists: async (
    val,
    { withStatus = false, status = true } = {}
  ) =>
    EmployeeModel.exists({
      _id: val,
      ...(withStatus ? { status } : {}),
    }).then(exists => {
      if (!exists) {
        return Promise.reject('Employee Does Not Exists')
      }
    }),
  checkEmployeeExistsByEmail: async val =>
    EmployeeModel.exists({ email: val, status: true }).then(exists => {
      if (!exists) {
        return Promise.reject('Employee Does Not Exists')
      }
    }),
  checkEmployeeUniqueByName: async (
    val,
    { unique = false, uniqueId = null } = {}
  ) =>
    EmployeeModel.exists({
      name: val,
      ...(unique ? { _id: { $ne: uniqueId } } : {}),
    }).then(exists => {
      if (exists) {
        return Promise.reject('Name Already Exists')
      }
    }),
  checkEmployeeUniqueByEmail: async (
    val,
    { unique = false, uniqueId = null } = {}
  ) =>
    EmployeeModel.exists({
      email: val,
      ...(unique ? { _id: { $ne: uniqueId } } : {}),
    }).then(exists => {
      if (exists) {
        return Promise.reject('Email Already Exists')
      }
    }),
}
