const fs = require('fs').promises
const { static_path } = require('../../../../config')

module.exports = {
  unlink: async file => {
    await fs.unlink(static_path + '/project/docs/' + file)
  },
}
