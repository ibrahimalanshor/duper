const multer = require('multer')
const path = require('path')
const { body, param, validationResult } = require('express-validator')
const { static_path } = require('../../../../../config')
const {
  UploadException,
  ValidationException,
} = require('../../../../exceptions')
const {
  checkDocumentUniqueByName,
  checkType,
} = require('../../validator/document')
const { unlink } = require('../../helpers')

const params = [
  param('id')
    .exists()
    .withMessage('ID Required')
    .bail()
    .isMongoId()
    .withMessage('ID Must Be MongoID'),
]

const storage = multer.diskStorage({
  destination: static_path + '/project/docs',
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    )
  },
})

const fileFilter = (req, file, cb) => {
  const mimeAccepted = [
    '.png',
    '.jpg',
    '.svg',
    '.pdf',
    '.odt',
    '.docx',
    '.xlsx',
    '.txt',
  ]
  const ext = path.extname(file.originalname)

  if (!mimeAccepted.includes(ext)) {
    cb(null, false)
    cb(new UploadException('File Type Not Accepted'))
  }

  req.body.file =
    file.fieldname + '-' + Date.now() + path.extname(file.originalname)

  cb(null, true)
}

const upload = multer({ storage, fileFilter })

const rules = [
  body('name')
    .exists()
    .withMessage('Name Required')
    .bail()
    .notEmpty()
    .withMessage('Name Required')
    .bail()
    .isAlpha('en-US', { ignore: ' ' })
    .withMessage('Name Must Be String')
    .bail()
    .custom((val, { req }) =>
      checkDocumentUniqueByName(val, { project_id: req.params.id })
    ),
  body('file')
    .exists()
    .withMessage('File Required')
    .bail()
    .notEmpty()
    .withMessage('File Required')
    .bail()
    .isString()
    .withMessage('File Required')
    .bail()
    .custom(val => checkType(val)),
]

const validator = async (req, res, next) => {
  try {
    const result = validationResult(req)

    if (!result.isEmpty()) {
      try {
        await unlink(req.body.file)
      } catch (err) {
        const errors = result.mapped()

        if (!errors.file) {
          errors.file = { params: 'file', msg: 'File Empty' }
        }

        throw errors
      }

      throw result.mapped()
    }

    next()
  } catch (err) {
    next(new ValidationException(err))
  }
}

module.exports = [upload.single('file'), params, validator, rules, validator]
