const Object3D = require('../models/Object3D');
const path = require('path');
const fs = require('fs');


const uploadObject = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    const object3D = await Object3D.create({
      user: req.user.id,
      name: req.body.name || req.file.originalname,
      fileUrl,
      interactionState: {
        rotation: { x: 0, y: 0, z: 0 },
        cameraPosition: { x: 0, y: 0, z: 5 },
        zoom: 1,
      },
    });

    res.status(201).json(object3D);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getObjects = async (req, res) => {
  try {
    const objects = await Object3D.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(objects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateState = async (req, res) => {
  try {
    const object3D = await Object3D.findById(req.params.id);

    if (!object3D) {
      return res.status(404).json({ message: 'Object not found' });
    }

    if (object3D.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    object3D.interactionState = req.body.interactionState;
    const updatedObject = await object3D.save();

    res.json(updatedObject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteObject = async (req, res) => {
  try {
    const object3D = await Object3D.findById(req.params.id);

    if (!object3D) {
      return res.status(404).json({ message: 'Object not found' });
    }

    if (object3D.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const filePath = path.join(__dirname, '../../', object3D.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await object3D.deleteOne();

    res.json({ message: 'Object removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadObject,
  getObjects,
  updateState,
  deleteObject,
};
