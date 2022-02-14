const TeamModel = require('../model')

module.exports = {
  checkTeamUniqueByName: async (
    val,
    { unique = false, uniqueId = null } = {}
  ) =>
    TeamModel.exists({
      name: val,
      ...(unique ? { _id: { $ne: uniqueId } } : {}),
    }).then(exists => {
      if (exists) {
        return Promise.reject('Name Already Exists')
      }
    }),
  checkEmployeeUniqueInTeam: async (val, team_id) =>
    TeamModel.exists({ _id: team_id, employees: val }).then(exists => {
      if (exists) {
        return Promise.reject('Employee Already Exists In Team')
      }
    }),
  checkEmployeeExistsInTeam: async (val, team_id) =>
    TeamModel.exists({ _id: team_id, employees: val }).then(exists => {
      if (!exists) {
        return Promise.reject('Employee Does Not Exists In Team')
      }
    }),
  checkTeamExists: async (val, { withStatus = false, status = true } = {}) =>
    TeamModel.exists({ _id: val, ...(withStatus ? { status } : {}) }).then(
      exists => {
        if (!exists) {
          return Promise.reject('Team Does Not Exists')
        }
      }
    ),
  checkLeader: async (team_id, user_id) => {
    const team = await TeamModel.findById(team_id)

    if (team?.leader.toString() !== user_id) throw "You're not allowed"
  },
}
