// middleware/upload.js
const multer = require('multer');
const path = require('path');

// Yüklenen dosyaların kaydedileceği dizin ve dosya adı ayarları
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Dosyalar 'uploads' klasörüne kaydedilir
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
