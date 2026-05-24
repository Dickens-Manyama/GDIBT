const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  summary: { type: String, required: true },
  image: { type: String, default: '/images/placeholder-product.jpg' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
