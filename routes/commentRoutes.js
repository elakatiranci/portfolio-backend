const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// Yorum ekle
router.post('/', async (req, res) => {
  const { blogId, author, content } = req.body;

  if (!blogId || !author || !content) {
    return res.status(400).json({ error: 'Lütfen tüm alanları doldurun' });
  }

  try {
    const newComment = new Comment({ blogId, author, content });
    await newComment.save();
    res.status(201).json({ message: 'Yorum başarıyla eklendi', comment: newComment });
  } catch (error) {
    console.error('Hata Detayı:', error);
    res.status(400).json({ error: 'Yorum eklenirken bir hata oluştu' });
  }
});

// Belirli bir blog gönderisine ait yorumları listele
router.get('/:blogId', async (req, res) => {
  try {
    const comments = await Comment.find({ blogId: req.params.blogId });
    res.status(200).json(comments);
  } catch (error) {
    console.error('Hata Detayı:', error);
    res.status(500).json({ error: 'Yorumlar alınırken bir hata oluştu' });
  }
});

// Tüm yorumları listele
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find(); // Tüm yorumları al
    res.status(200).json(comments);
  } catch (error) {
    console.error('Hata Detayı:', error);
    res.status(500).json({ error: 'Yorumlar alınırken bir hata oluştu' });
  }
});

// Blog altındaki yorumu silme route'u
router.delete('/:blogId/comments/:commentId', async (req, res) => {
  try {
    // Blog'u ID'ye göre bul
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) return res.status(404).json({ message: 'Blog bulunamadı' });

    // comments dizisinden silinecek yorumun indeksini bul
    const commentIndex = blog.comments.findIndex(comment => comment._id.toString() === req.params.commentId);

    // Eğer yorum bulunamazsa hata döndür
    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Yorum bulunamadı' });
    }

    // Yorumu diziden sil
    blog.comments.splice(commentIndex, 1);

    // Blog'u kaydet
    await blog.save();

    res.status(200).json({ message: 'Yorum başarıyla silindi' });
  } catch (error) {
    console.error('Hata Detayı:', error);
    res.status(500).json({ error: 'Yorum silinirken bir hata oluştu' });
  }
});


module.exports = router;
