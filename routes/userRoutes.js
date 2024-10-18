// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // bcrypt modülünü içe aktar
const User = require('../models/User');

// Kullanıcı kaydı
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Kullanıcı zaten mevcut.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Şifreyi hashle
    const newUser = new User({ username, email, password: hashedPassword }); // Hashlenmiş şifreyi kullan
    await newUser.save();
    res.status(201).json({ message: 'Kullanıcı başarıyla kaydedildi' });
  } catch (error) {
    console.error('Kullanıcı kaydı sırasında hata:', error);
    res.status(500).json({ error: 'Kullanıcı kaydı sırasında bir hata oluştu' });
  }
});

// Kullanıcı güncelleme
router.put('/:id', async (req, res) => {
  const { id } = req.params; // URL'den ID'yi alıyoruz
  const { username, email, password } = req.body; // Güncellenen veriler

  try {
    // ID ile kullanıcıyı bulup güncelle
    const updatedUser = await User.findByIdAndUpdate(
      id, // Kullanıcı ID'si
      {
        username: username,
        email: email, // Yeni kullanıcı adı
        password: password, // Yeni şifre
      },
      { new: true, runValidators: true } // Güncellenmiş kullanıcıyı geri döndür ve doğrulama çalıştır
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    res.json({ message: "Kullanıcı başarıyla güncellendi", user: updatedUser });
  } catch (error) {
    console.error("Kullanıcı güncellenirken hata:", error);
    res.status(500).json({ message: "Kullanıcı güncellenirken bir hata oluştu." });
  }
});




// Kullanıcıları listeleme
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Şifreyi hariç tutarak kullanıcıları getir
    res.status(200).json(users);
  } catch (error) {
    console.error('Kullanıcılar alınırken hata:', error);
    res.status(500).json({ error: 'Kullanıcılar alınırken bir hata oluştu' });
  }
});

// Belirli bir kullanıcıyı ID'ye göre alma
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select('-password'); // Şifreyi hariç tutarak kullanıcıyı getir
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Hata Detayı:', error);
    res.status(500).json({ error: 'Kullanıcı alınırken bir hata oluştu' });
  }
});

// Kullanıcı silme
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }
    res.status(200).json({ message: 'Kullanıcı başarıyla silindi.' });
  } catch (error) {
    console.error('Kullanıcı silinirken hata:', error);
    res.status(500).json({ error: 'Kullanıcı silinirken bir hata oluştu' });
  }
});



module.exports = router;
