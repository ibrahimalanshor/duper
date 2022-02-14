const ProjectModel = require('../model')

module.exports = {
  checkTaskUniqueByName: async (
    val,
    { project_id, board_id, unique = false, uniqueId = null } = {}
  ) =>
    ProjectModel.exists({
      _id: project_id,
      boards: {
        $elemMatch: {
          _id: board_id,
          tasks: {
            $elemMatch: {
              name: val,
              ...(unique ? { _id: { $ne: uniqueId } } : {}),
            },
          },
        },
      },
    }).then(exists => {
      if (exists) {
        return Promise.reject('Task already exists')
      }
    }),
}
