const mongoose = require('mongoose');

const investorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  interestArea: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: 'new' }
}, { timestamps: true });

module.exports = mongoose.model('Investor', investorSchema);
