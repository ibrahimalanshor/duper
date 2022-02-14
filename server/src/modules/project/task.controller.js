const ProjectModel = require('./model')
const { notFound } = require('../../helpers')

class TaskController {
  async store(req, res, next) {
    try {
      const updated = await ProjectModel.updateOne(
        {
          _id: req.params.id,
          boards: { $elemMatch: { _id: req.params.board_id } },
        },
        { $push: { 'boards.$.tasks': req.body } }
      )

      notFound(!updated.matchedCount, 'Project Not Found')

      return res.status(201).json({ message: 'Task Created' })
    } catch (err) {
      next(err)
    }
  }

  async update(req, res, next) {
    try {
      const board = await ProjectModel.findOneAndUpdate(
        {
          _id: req.params.id,
          boards: {
            $elemMatch: {
              _id: req.params.board_id,
              tasks: {
                $elemMatch: {
                  _id: req.params.task_id,
                },
              },
            },
          },
        },
        {
          $set: {
            'boards.$[board].tasks.$[task].name': req.body.name,
            ...(req.body.description
              ? {
                  'boards.$[board].tasks.$[task].description':
                    req.body.description,
                }
              : {}),
            ...(req.body.label
              ? {
                  'boards.$[board].tasks.$[task].label': req.body.label,
                }
              : {}),
            ...(req.body.estimate
              ? {
                  'boards.$[board].tasks.$[task].estimate': req.body.estimate,
                }
              : {}),
          },
        },
        {
          arrayFilters: [
            { 'board._id': req.params.board_id },
            { 'task._id': req.params.task_id },
          ],
        }
      )

      notFound(!board, 'Project Not Found')

      return res.status(200).json({ message: 'Task Updated' })
    } catch (err) {
      next(err)
    }
  }

  async updateStatus(req, res, next) {
    try {
      const board = await ProjectModel.findOneAndUpdate(
        {
          _id: req.params.id,
          boards: {
            $elemMatch: {
              _id: req.params.board_id,
              tasks: {
                $elemMatch: {
                  _id: req.params.task_id,
                },
              },
            },
          },
        },
        {
          $set: {
            'boards.$[board].tasks.$[task].status': req.body.status,
          },
        },
        {
          arrayFilters: [
            { 'board._id': req.params.board_id },
            { 'task._id': req.params.task_id },
          ],
        }
      )

      notFound(!board, 'Project Not Found')

      return res.status(200).json({ message: 'Board Updated' })
    } catch (err) {
      next(err)
    }
  }

  async updateWorker(req, res, next) {
    try {
      const board = await ProjectModel.findOneAndUpdate(
        {
          _id: req.params.id,
          boards: {
            $elemMatch: {
              _id: req.params.board_id,
              tasks: {
                $elemMatch: {
                  _id: req.params.task_id,
                },
              },
            },
          },
        },
        {
          $set: {
            'boards.$[board].tasks.$[task].worker': req.body.worker,
          },
        },
        {
          arrayFilters: [
            { 'board._id': req.params.board_id },
            { 'task._id': req.params.task_id },
          ],
        }
      )

      notFound(!board, 'Project Not Found')

      return res.status(200).json({ message: 'Board Updated' })
    } catch (err) {
      next(err)
    }
  }

  async delete(req, res, next) {
    try {
      const board = await ProjectModel.findOneAndUpdate(
        {
          _id: req.params.id,
          boards: {
            $elemMatch: {
              _id: req.params.board_id,
              tasks: {
                $elemMatch: {
                  _id: req.params.task_id,
                },
              },
            },
          },
        },
        {
          $pull: {
            'boards.$.tasks': {
              _id: req.params.task_id,
            },
          },
        }
      )

      notFound(!board, 'Project Not Found')

      return res.status(200).json({ message: 'Task Deleted' })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = new TaskController()
