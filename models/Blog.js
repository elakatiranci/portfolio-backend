
const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    author: { type: String, required: true },
    category: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String },
    tags: { type: [String], required: true },
    likes: { type: Number, default: 0, },
    comments: [{ content: { type: String } }], // Yorumlar alanı
  }, { timestamps: true ,
    
  });

module.exports = mongoose.model('Blog', BlogSchema);
