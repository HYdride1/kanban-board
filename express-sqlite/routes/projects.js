// routes/projects.js
const express = require('express');
const db = require('../database');

const router = express.Router();

// 获取所有项目
router.get('/', (req, res) => {
  db.all('SELECT * FROM projects', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ projects: rows });
  });
});

// 创建新项目
router.post('/', (req, res) => {
  const { name, description } = req.body;
  db.run(
    'INSERT INTO projects (name, description) VALUES (?, ?)',
    [name, description],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ id: this.lastID, name, description });
    }
  );
});

// 删除项目
router.delete('/:id', (req, res) => {
  const projectId = req.params.id;
  db.run('DELETE FROM projects WHERE id = ?', [projectId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ deleted: this.changes });
  });
});

module.exports = router;
