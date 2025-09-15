// models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title : { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true }, // keep string if you want "0.00"
  image_url: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);
