const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  uploadObject,
  getObjects,
  updateState,
  deleteObject,
} = require('../controllers/objectController');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /glb|gltf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    } else {
      cb('Error: GLB/GLTF Files Only!');
    }
  },
});

router.route('/')
  .get(protect, getObjects)
  .post(protect, upload.single('file'), uploadObject);

router.route('/:id/state')
  .put(protect, updateState);

router.route('/:id')
  .delete(protect, deleteObject);

module.exports = router;
