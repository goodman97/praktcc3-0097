const express = require('express');
const router = express.Router();
const db = require('../db');

// Ambil semua catatan
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM notes ORDER BY id DESC';

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: 'Gagal mengambil data catatan',
        error: err.message
      });
    }

    res.status(200).json(results);
  });
});

// Ambil satu catatan berdasarkan id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM notes WHERE id = ?';

  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: 'Gagal mengambil data catatan',
        error: err.message
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: 'Catatan tidak ditemukan'
      });
    }

    res.status(200).json(results[0]);
  });
});

// Tambah catatan
router.post('/', (req, res) => {
  const { judul, isi } = req.body;

  if (!judul || !isi) {
    return res.status(400).json({
      message: 'Judul dan isi wajib diisi'
    });
  }

  const sql = 'INSERT INTO notes (judul, isi) VALUES (?, ?)';

  db.query(sql, [judul, isi], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: 'Gagal menambah catatan',
        error: err.message
      });
    }

    res.status(201).json({
      message: 'Catatan berhasil ditambahkan',
      id: result.insertId
    });
  });
});

// Edit catatan
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { judul, isi } = req.body;

  if (!judul || !isi) {
    return res.status(400).json({
      message: 'Judul dan isi wajib diisi'
    });
  }

  const sql = 'UPDATE notes SET judul = ?, isi = ? WHERE id = ?';

  db.query(sql, [judul, isi, id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: 'Gagal mengedit catatan',
        error: err.message
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Catatan tidak ditemukan'
      });
    }

    res.status(200).json({
      message: 'Catatan berhasil diupdate'
    });
  });
});

// Hapus catatan
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM notes WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: 'Gagal menghapus catatan',
        error: err.message
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Catatan tidak ditemukan'
      });
    }

    res.status(200).json({
      message: 'Catatan berhasil dihapus'
    });
  });
});

module.exports = router;