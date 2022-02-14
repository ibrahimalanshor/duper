const ProjectModel = require('./model')
const { notFound } = require('../../helpers')
const { unlink } = require('./helpers')

class DocumentController {
  async store(req, res, next) {
    try {
      const updated = await ProjectModel.updateOne(
        { _id: req.params.id },
        { $push: { documents: req.body } }
      )

      notFound(!updated.matchedCount, 'Project Not Found', async () => {
        await unlink(req.body.file)
      })

      return res.status(201).json({ message: 'Document Created' })
    } catch (err) {
      next(err)
    }
  }

  async update(req, res, next) {
    try {
      const document = await ProjectModel.findOneAndUpdate(
        {
          _id: req.params.id,
          documents: { $elemMatch: { _id: req.params.document_id } },
        },
        {
          $set: {
            'documents.$.name': req.body.name,
            ...(req.body.file ? { 'documents.$.file': req.body.file } : {}),
          },
        }
      ).select({
        documents: { $elemMatch: { _id: req.params.document_id } },
      })

      if (req.body.file) {
        notFound(!document, 'Project Not Found', async () => {
          await unlink(req.body.file)
        })

        const file = document.documents[0].file

        await unlink(file)
      }

      return res.status(200).json({ message: 'Document Updated' })
    } catch (err) {
      next(err)
    }
  }

  async delete(req, res, next) {
    try {
      const document = await ProjectModel.findOneAndUpdate(
        {
          _id: req.params.id,
          documents: { $elemMatch: { _id: req.params.document_id } },
        },
        { $pull: { documents: { _id: req.params.document_id } } }
      ).select({
        documents: { $elemMatch: { _id: req.params.document_id } },
      })

      notFound(!document, 'Project Not Found')

      const file = document.documents[0].file

      await unlink(file)

      return res.status(200).json({ message: 'Document Deleted' })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = new DocumentController()
