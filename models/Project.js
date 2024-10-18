// models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  author: { type: String, required: true },
  category: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  link: { type: String }, // Proje linki (isteğe bağlı)
  file: { type: String }, // Dosya yükleme (dosya adı),
  image: { type: String },
  tags: { type: [String], required: true },
  comments: [{ content: String, createdAt: { type: Date, default: Date.now } }], // Yorumlar için alan
  likes: { type: Number, default: 0 } // Beğeni sayısı
});

module.exports = mongoose.model('Project', projectSchema);
