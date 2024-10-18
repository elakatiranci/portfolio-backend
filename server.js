const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const projectRoutes = require('./routes/projectRoutes');
const userRoutes = require('./routes/userRoutes');
const commentRoutes = require('./routes/commentRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
require('dotenv').config();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Yeni frontend'in URL'si (örneğin: http://localhost:3000)
  credentials: true, // Gerektiğinde kimlik doğrulama çerezlerini göndermek için
}));
app.use(express.json());

// Ana route
app.get('/', (req, res) => {
  res.send('Merhaba, Backend Çalışıyor!');
});

// Veritabanı bağlantısı
connectDB();

// Route'ları ekle
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} üzerinde çalışıyor`);
});

// Proje dosyalarını serve etmek için statik dosya servisi
app.use('/uploads', express.static('uploads'));

// Proje rotalarını kullan
app.use('/api/projects', projectRoutes);

// Kullanıcı route'unu ekleyin
app.use('/api/users', userRoutes);

// Yorum route'unu ekleyin  
app.use('/api/comments', commentRoutes);

