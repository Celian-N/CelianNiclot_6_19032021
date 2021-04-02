const multer = require('multer');
const path = require('path');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const filename = path.parse(name).name
    const extension = MIME_TYPES[file.mimetype];
    
    callback(null, filename +'-'+ Date.now() + '.' + extension);
  },
});

module.exports = multer({ storage : storage }).single('image');
