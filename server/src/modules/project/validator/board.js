const ProjectModel = require('../model')

module.exports = {
  checkBoardUniqueByName: async (
    val,
    { project_id, unique = false, uniqueId = null } = {}
  ) =>
    ProjectModel.exists({
      _id: project_id,
      boards: {
        $elemMatch: {
          name: val,
          ...(unique ? { _id: { $ne: uniqueId } } : {}),
        },
      },
    }).then(exists => {
      if (exists) {
        return Promise.reject('Board already exists')
      }
    }),
}
