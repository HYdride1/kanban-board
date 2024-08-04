// routes/tasks.js
const express = require('express');
const db = require('../database');

const router = express.Router();

// 获取所有任务
router.get('/', (req, res) => {
  db.all('SELECT * FROM tasks', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// 获取指定项目的任务
router.get('/:projectId', (req, res) => {
  const projectId = req.params.projectId;
  db.all('SELECT * FROM tasks WHERE project_id = ?', [projectId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// 添加任务
router.post('/:projectId', (req, res) => {
  const projectId = req.params.projectId;
  const { title, description, attachment } = req.body;

  db.run(`
    INSERT INTO tasks (project_id, title, description, attachment)
    VALUES (?, ?, ?, ?)
  `, [projectId, title, description, attachment], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ id: this.lastID, title, description, attachment });
  });
});

// 更新任务
router.put('/:taskId', (req, res) => {
  const taskId = req.params.taskId;
  const { project_id } = req.body;

  db.run(`
    UPDATE tasks SET project_id = ? WHERE id = ?
  `, [project_id, taskId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ success: true });
  });
});

// 删除任务
router.delete('/:taskId', (req, res) => {
  const taskId = req.params.taskId;

  db.run(`
    DELETE FROM tasks WHERE id = ?
  `, [taskId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ success: true });
  });
});

// 提供下载附件的功能
router.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, '..', 'uploads', filename);
  res.download(filepath);
});

module.exports = router;
