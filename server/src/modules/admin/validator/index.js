const AdminModel = require('../model')

module.exports = {
  checkAdminExistsByUsername: async val =>
    AdminModel.exists({ username: val }).then(exists => {
      if (!exists) {
        return Promise.reject('Username Does Not Exists')
      }
    }),
  checkAdminUniqueByUsername: async (
    val,
    { unique = false, uniqueId = null } = {}
  ) =>
    AdminModel.exists({
      username: val,
      ...(unique ? { _id: { $ne: uniqueId } } : {}),
    }).then(exists => {
      if (exists) {
        return Promise.reject('Username Already Exists')
      }
    }),
}
