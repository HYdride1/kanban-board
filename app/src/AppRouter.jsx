// src/AppRouter.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import TaskDetails from './pages/TaskDetails';
import Kanban from './pages/Kanban'; // 引入任务看板页面

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:projectId/tasks" element={<Tasks />} />
        <Route path="/taskDetails/:taskId" element={<TaskDetails />} />
        <Route path="/kanban" element={<Kanban />} /> {/* 任务看板页面路由 */}
      </Routes>
    </Router>
  );
};

export default AppRouter;
