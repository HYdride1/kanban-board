// routes/taskDetails.js
const express = require('express');
const db = require('../database');

const router = express.Router();

// 获取任务详情和评论
router.get('/:taskId', (req, res) => {
  const taskId = req.params.taskId;
  db.get('SELECT * FROM tasks WHERE id = ?', [taskId], (err, task) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    db.all('SELECT * FROM comments WHERE task_id = ?', [taskId], (err, comments) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ task, comments });
    });
  });
});

// 添加评论
router.post('/:taskId/comments', (req, res) => {
  const taskId = req.params.taskId;
  const { comment } = req.body;
  db.run('INSERT INTO comments (task_id, comment) VALUES (?, ?)', [taskId, comment], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ id: this.lastID, comment });
  });
});

module.exports = router;
