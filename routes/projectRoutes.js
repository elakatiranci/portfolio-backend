const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const upload = require('../middleware/upload');

// Yeni proje oluşturma
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { author, category, title, content, link, image, tags } = req.body;
    const file = req.file ? req.file.filename : null; // Dosya varsa dosya adını al

    const newProject = new Project({
      author,
      category,
      title,
      content,
      link,
      file, // Dosya adı veritabanına kaydedilir
      image: req.body.image || '', // İsteğe bağlı olarak resim eklenebilir
      tags,
    });

    await newProject.save();
    res.status(201).json({ message: 'Proje başarıyla oluşturuldu', project: newProject });
  } catch (error) {
    console.error('Proje eklenirken hata:', error);
    res.status(500).json({ error: 'Proje eklenirken bir hata oluştu' });
  }
});

// Tüm projeleri listeleme
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    console.error('Projeler alınırken hata:', error);
    res.status(500).json({ error: 'Projeler alınırken bir hata oluştu' });
  }
});

// Belirli bir projeyi ID'ye göre al
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findById(id); // ID'ye göre projeyi bul
    if (!project) {
      return res.status(404).json({ error: 'Proje bulunamadı' });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error('Hata Detayı:', error);
    res.status(500).json({ error: 'Proje alınırken bir hata oluştu' });
  }
});

// Proje güncelleme
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { author, category, title, content, link, file, image, tags } = req.body;

  try {
      const updatedProject = await Project.findByIdAndUpdate(
          id,
          { author, category, title, content, link, file, image, tags },
          { new: true } // Güncellenmiş projeyi geri döndür
      );

      if (!updatedProject) {
          return res.status(404).json({ message: "Proje bulunamadı." });
      }

      res.json(updatedProject);
  } catch (error) {
      console.error("Hata Detayı:", error);
      res.status(500).json({ message: "Proje güncellenirken bir hata oluştu." });
  }
});

// Proje silme
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProject = await Project.findByIdAndDelete(id);
    if (!deletedProject) {
      return res.status(404).json({ message: "Proje bulunamadı." });
    }
    res.status(200).json({ message: "Proje başarıyla silindi." });
  } catch (error) {
    console.error("Hata Detayı:", error);
    res.status(500).json({ message: "Proje silinirken bir hata oluştu." });
  }
});

// Yorum ekleme
router.post('/:id/comments', async (req, res) => {
  const { content } = req.body;

  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Proje bulunamadı' });

    const newComment = { content };
    project.comments.push(newComment);
    await project.save();

    res.status(201).json({ message: 'Yorum başarıyla eklendi', comment: newComment });
  } catch (error) {
    console.error('Hata Detayı:', error);
    res.status(400).json({ error: 'Yorum eklenirken bir hata oluştu' });
  }
});

// Beğeni ekleme
router.put('/:id/like', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Proje bulunamadı' });
    }

    project.likes += 1; // Beğeni sayısını artır

    await project.save();
    res.json({ message: 'Beğeni başarıyla eklendi', likes: project.likes });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error });
  }
});

module.exports = router;
