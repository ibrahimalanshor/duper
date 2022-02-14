const path = require('path')
const ProjectModel = require('../model')

module.exports = {
  checkDocumentUniqueByName: async (
    val,
    { project_id, unique = false, uniqueId = null } = {}
  ) =>
    ProjectModel.exists({
      _id: project_id,
      documents: {
        $elemMatch: {
          name: val,
          ...(unique ? { _id: { $ne: uniqueId } } : {}),
        },
      },
    }).then(exists => {
      if (exists) {
        return Promise.reject('Document already exists')
      }
    }),
  checkType: file => {
    const allowed = ['png', 'jpg', 'svg', 'pdf', 'odt', 'docx', 'xlsx', 'txt']
    const ext = path.extname(file).slice(1)

    if (!allowed.includes(ext)) throw new Error('Filetype not accepted')

    return true
  },
}
