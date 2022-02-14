const ProjectModel = require('../model')
const { Types } = require('mongoose')

module.exports = {
  checkProjectUniqueByName: async (
    val,
    { unique = false, uniqueId = null } = {}
  ) =>
    ProjectModel.exists({
      name: val,
      ...(unique ? { _id: { $ne: uniqueId } } : {}),
    }).then(exists => {
      if (exists) {
        return Promise.reject('Project Name Exists')
      }
    }),
  checkWorkerInTeamProject: async (val, project_id) => {
    const project = await ProjectModel.findById(project_id)
      .populate('team')
      .select('team')

    if (!project) throw 'Project Does Not Exists'

    const teamEmployees = project.team.employees
    const employee = Types.ObjectId(val)

    if (!teamEmployees.includes(employee)) throw 'Employees Not In Team'
  },
  checkLeader: async (project_id, user_id) => {
    const project = await ProjectModel.findById(project_id)
      .select('team')
      .populate('team', 'leader')

    if (project?.team?.leader.toString() !== user_id) throw "You're not allowed"
  },
  checkTeam: async (project_id, user_id) => {
    const project = await ProjectModel.findById(project_id)
      .select('team')
      .populate('team', 'employees')
    const exists = project?.team?.employees?.some(
      employee => employee.toString() === user_id
    )

    if (!exists) throw "You're not allowed"
  },
  checkWorker: async (project_id, board_id, task_id, user_id) => {
    const tasks = await ProjectModel.findOne({
      _id: project_id,
      boards: {
        $elemMatch: {
          _id: board_id,
          tasks: {
            $elemMatch: {
              _id: task_id,
            },
          },
        },
      },
    }).select({
      documents: 0,
      boards: {
        $elemMatch: {
          _id: board_id,
        },
      },
    })

    const exists = tasks?.boards[0]?.tasks?.some(task => {
      if (task._id.toString() === task_id) {
        return task.worker.toString() === user_id
      } else {
        return false
      }
    })

    if (!exists) throw "You're not allowed"
  },
}
