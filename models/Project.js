const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phase: { type: String, required: true },
  location: { type: String, required: true },
  summary: { type: String, required: true },
  status: { type: String, default: 'planned' }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
