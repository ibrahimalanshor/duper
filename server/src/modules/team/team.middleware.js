const { checkLeader } = require('./validator')
const { AuthException } = require('../../exceptions')

module.exports = {
  leader: async (req, res, next) => {
    try {
      const auth = req.auth

      if (auth.role === 'employee') {
        await checkLeader(req.params.id, auth.user._id)
      }

      next()
    } catch (err) {
      next(new AuthException(err))
    }
  },
}
