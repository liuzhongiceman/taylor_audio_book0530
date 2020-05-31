const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const dotenv = require('dotenv');
dotenv.config();

aws.config.update({
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  accessKeyId: process.env.ACCESS_KEY_ID,
  region: 'us-west-1'
});

const isValidFile = (file) => {
  return true;
  // return file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif'|| file.mimetype === 'image/mpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/HEIC'
  // || file.mimetype === 'audio/mp3' || file.mimetype === 'audio/mp4' || file.mimetype === 'audio/wav' || file.mimetype === 'audio/wma' || file.mimetype === 'audio/m4a';
}

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
  if (isValidFile(file)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type!'), false);
  }
};

const upload = multer({
  fileFilter: fileFilter,
  storage: multerS3({
    acl: 'public-read',
    s3,
    bucket: 'taylor-audio-books',
    key: function(req, file, cb) {
      req.file = Date.now() + file.originalname;
      cb(null, Date.now() + file.originalname);
    }
  })
});

module.exports = upload;
