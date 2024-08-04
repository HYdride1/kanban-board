const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  // 创建用户表
  db.run(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);

  // 创建项目表
  db.run(`
    CREATE TABLE projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT
    )
  `);

  // 创建任务表
  db.run(`
    CREATE TABLE tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER,
      title TEXT,
      description TEXT,
      attachment TEXT,
      FOREIGN KEY(project_id) REFERENCES projects(id)
    )
  `);

  // 创建评论表
  db.run(`
    CREATE TABLE comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id INTEGER,
      comment TEXT,
      FOREIGN KEY(task_id) REFERENCES tasks(id)
    )
  `);

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync('password123', salt);

  // 插入初始用户数据
  db.run(`
    INSERT INTO users (username, password)
    VALUES ('user1', ?), ('user2', ?),('user3', ?),('user4', ?),('user5', ?)
  `, [hashedPassword, hashedPassword, hashedPassword, hashedPassword, hashedPassword,]);

  // 插入初始项目数据
  db.run(`
    INSERT INTO projects (name, description)
    VALUES ('Project 1', 'Description of project 1'), 
           ('Project 2', 'Description of project 2'),
           ('Project 3', 'Description of project 3'),
           ('Project 4', 'Description of project 4'),
           ('Project 5', 'Description of project 5'),
           ('Project 6', 'Description of project 6')

  `);

  // 插入初始任务数据
  db.run(`
    INSERT INTO tasks (project_id, title, description, attachment)
    VALUES 
      (1, 'Task 1 for Project 1', 'Description for task 1', 'attachment1.pdf'),
      (1, 'Task 2 for Project 1', 'Description for task 2', 'attachment2.pdf'),
      (2, 'Task 1 for Project 2', 'Description for task 1', 'attachment3.pdf'),
      (2, 'Task 2 for Project 2', 'Description for task 2', 'attachment4.pdf'),
      (3, 'Task 1 for Project 3', 'Description for task 1', 'attachment5.pdf'),
      (3, 'Task 2 for Project 3', 'Description for task 2', 'attachment6.pdf'),
      (4, 'Task 1 for Project 4', 'Description for task 1', 'attachment7.pdf'),
      (4, 'Task 2 for Project 4', 'Description for task 2', 'attachment8.pdf'),
      (5, 'Task 1 for Project 5', 'Description for task 1', 'attachment9.pdf'),
      (5, 'Task 2 for Project 5', 'Description for task 2', 'attachment10.pdf'),
      (6, 'Task 2 for Project 5', 'Description for task 2', 'attachment10.pdf')

  `);

  // 插入初始评论数据
  db.run(`
    INSERT INTO comments (task_id, comment)
    VALUES 
      (1, 'Comment 1 for Task 1'),
      (1, 'Comment 2 for Task 1'),
      (2, 'Comment 1 for Task 2'),
      (2, 'Comment 2 for Task 2'),
      (3, 'Comment 1 for Task 1'),
      (3, 'Comment 2 for Task 1'),
      (4, 'Comment 1 for Task 2'),
      (4, 'Comment 2 for Task 2'),
      (5, 'Comment 1 for Task 1'),
      (5, 'Comment 2 for Task 1')
  `);
});

module.exports = db;
