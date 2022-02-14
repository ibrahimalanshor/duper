const multer = require('multer')
const path = require('path')
const { static_path } = require('../../../../config')
const { UploadException } = require('../../../exceptions')

const storage = multer.diskStorage({
  destination: static_path + '/project/docs',
  filename: (req, file, cb) => {
    console.log(file)
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
  ]
  const ext = path.extname(file.originalname)

  if (!mimeAccepted.includes(ext)) {
    cb(null, false)
    cb(new UploadException('File Type Not Accepted'))
  }

  cb(null, true)
}

const upload = multer({ storage, fileFilter })

module.exports = [
  upload.single('file'),
  (req, res, next) => res.status(200).json(req.file),
]
