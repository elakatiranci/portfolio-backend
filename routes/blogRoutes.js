const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const mongoose = require('mongoose');


// Yeni blog oluştur
router.post('', async (req, res) => {
  console.log('Gelen veri:', req.body); // Gelen veriyi kontrol edin
  const { author, category, title, content, image, tags } = req.body;

  if (!title || !content || !category || !tags) {
    return res.status(400).json({ error: 'Lütfen tüm alanları doldurun' });
  }

  try {
    const newBlog = new Blog({ author, category, title, content, image, tags });
    await newBlog.save();
    res.status(201).json({ message: 'Blog başarıyla oluşturuldu', blog: newBlog });
  } catch (error) {
    console.error('Hata Detayı:', error); 
    res.status(400).json({ error: 'Blog oluşturulurken bir hata oluştu' });
  }
});


// Tek bir blogu görüntüle
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id); // ID ile blogu bul
    if (!blog) return res.status(404).json({ error: 'Blog bulunamadı' });
    res.status(200).json(blog);
  } catch (error) {
    console.error('Hata Detayı:', error);
    res.status(500).json({ error: 'Blog alınırken bir hata oluştu' });
  }
});

// Tüm blogları listele
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find(); // Tüm blogları al
    res.status(200).json(blogs);
  } catch (error) {
    console.error('Hata Detayı:', error);
    res.status(500).json({ error: 'Bloglar alınırken bir hata oluştu' });
  }
});

// Blog güncelle
router.put('/:id', async (req, res) => {
  const { author, category, title, content, image, tags } = req.body;
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, { author, category, title, content, image, tags }, { new: true });
    if (!updatedBlog) return res.status(404).json({ error: 'Blog bulunamadı' });
    res.status(200).json({ message: 'Blog başarıyla güncellendi', blog: updatedBlog });
  } catch (error) {
    console.error('Hata Detayı:', error);
    res.status(400).json({ error: 'Blog güncellenirken bir hata oluştu' });
  }
});

// Blog sil
router.delete('/:id', async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id); // ID ile blogu sil
    if (!deletedBlog) return res.status(404).json({ error: 'Blog bulunamadı' });
    res.status(200).json({ message: 'Blog başarıyla silindi' });
  } catch (error) {
    console.error('Hata Detayı:', error);
    res.status(500).json({ error: 'Blog silinirken bir hata oluştu' });
  }
});

// Yorum ekleme route'u
router.post('/comments', async (req, res) => {
  const { content } = req.body;

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog bulunamadı' });

    const newComment = { content };
    blog.comments.push(newComment);
    await blog.save();

    res.status(201).json({ message: 'Yorum başarıyla eklendi', comment: newComment });
  } catch (error) {
    console.error('Hata Detayı:', error);
    res.status(400).json({ error: 'Yorum eklenirken bir hata oluştu' });
  }
});

// Blog yorumları için route'ları ekleyin
router.post('/:id/comments', async (req, res) => {
  const { content } = req.body; // Yorum içeriğini alın

  if (!content) {
    return res.status(400).json({ error: 'Yorum içeriği gerekli' });
  }

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog bulunamadı' });

    // Blogun yorumları alanına yeni yorumu ekleyin
    blog.comments.push({ content });
    await blog.save();

    res.status(201).json({ message: 'Yorum başarıyla eklendi', comment: { content } });
  } catch (error) {
    console.error('Hata Detayı:', error);
    res.status(500).json({ error: 'Yorum eklenirken bir hata oluştu' });
  }
});

// Beğeni ekleme rotası
router.put('/:id/like', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog bulunamadı' });
    }

    blog.likes = blog.likes ? blog.likes + 1 : 1; // Beğeni sayısını artır

    await blog.save();
    res.json({ message: 'Beğeni başarıyla eklendi', likes: blog.likes });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error });
  }
});

module.exports = router;
