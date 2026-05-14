const mongoose = require('mongoose');

const object3DSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  interactionState: {
    rotation: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
      z: { type: Number, default: 0 },
    },
    cameraPosition: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
      z: { type: Number, default: 5 },
    },
    zoom: { type: Number, default: 1 },
  },
}, { timestamps: true });

module.exports = mongoose.model('Object3D', object3DSchema);
