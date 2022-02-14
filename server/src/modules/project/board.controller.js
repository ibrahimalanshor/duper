const ProjectModel = require('./model')
const { notFound } = require('../../helpers')

class BoardController {
  async store(req, res, next) {
    try {
      const updated = await ProjectModel.updateOne(
        { _id: req.params.id },
        { $push: { boards: req.body } }
      )

      notFound(!updated.matchedCount, 'Project Not Found')

      return res.status(201).json({ message: 'Board Created' })
    } catch (err) {
      next(err)
    }
  }

  async show(req, res, next) {
    try {
      const board = await ProjectModel.findOne({
        _id: req.params.id,
        boards: { $elemMatch: { _id: req.params.board_id } },
      })
        .select({
          boards: { $elemMatch: { _id: req.params.board_id } },
        })
        .populate({
          path: 'boards',
          populate: {
            path: 'tasks',
            populate: {
              path: 'worker',
            },
          },
        })
        .populate({
          path: 'team',
        })

      notFound(!board, 'Board Not Found')

      return res.status(200).json(board)
    } catch (err) {
      next(err)
    }
  }

  async update(req, res, next) {
    try {
      const board = await ProjectModel.findOneAndUpdate(
        {
          _id: req.params.id,
          boards: { $elemMatch: { _id: req.params.board_id } },
        },
        {
          $set: {
            'boards.$.name': req.body.name,
            ...(req.body.description
              ? { 'boards.$.description': req.body.description }
              : {}),
            ...(req.body.label ? { 'boards.$.label': req.body.label } : {}),
          },
        }
      )

      notFound(!board, 'Project Not Found')

      return res.status(200).json({ message: 'Board Updated' })
    } catch (err) {
      next(err)
    }
  }

  async updateStatus(req, res, next) {
    try {
      const board = await ProjectModel.findOneAndUpdate(
        {
          _id: req.params.id,
          boards: { $elemMatch: { _id: req.params.board_id } },
        },
        {
          $set: {
            'boards.$.status': req.body.status,
          },
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
          boards: { $elemMatch: { _id: req.params.board_id } },
        },
        {
          $pull: { boards: { _id: req.params.board_id } },
        }
      )

      notFound(!board, 'Project Not Found')

      return res.status(200).json({ message: 'Board Deleted' })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = new BoardController()
