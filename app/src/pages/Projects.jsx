// src/pages/Projects.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { List, Input, Button, Form, message } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:3000/projects');
      setProjects(response.data.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (values) => {
    try {
      await axios.post('http://localhost:3000/projects', values);
      fetchProjects();
      form.resetFields();
      message.success('Project created successfully');
    } catch (error) {
      console.error('Error creating project:', error);
      message.error('Failed to create project');
    }
  };

  const deleteProject = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/projects/${id}`);
      fetchProjects();
      message.success('Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      message.error('Failed to delete project');
    }
  };

  return (
    <div className="container">
      <h1 className="title">项目管理系统</h1>
      
      <div className="project-form">
        <h2 className="subtitle">创建新项目</h2>
        <Form form={form} layout="vertical" onFinish={createProject}>
          <Form.Item name="name" label="项目名称" rules={[{ required: true, message: '请输入项目名称' }]}>
            <Input placeholder="项目名称" />
          </Form.Item>
          <Form.Item name="description" label="项目描述" rules={[{ required: true, message: '请输入项目描述' }]}>
            <Input.TextArea placeholder="项目描述" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>创建项目</Button>
          </Form.Item>
        </Form>
      </div>

      <div className="project-list">
        <h2 className="subtitle">项目列表</h2>
        <List
          loading={loading}
          bordered
          dataSource={projects}
          renderItem={project => (
            <List.Item actions={[
              <Link to={`/projects/${project.id}/tasks`}>
                <Button type="primary">任务列表</Button>
              </Link>,
              <Link to="/kanban">
                <Button type="default">查看看板</Button>
              </Link>,
              <Button type="danger" icon={<DeleteOutlined />} onClick={() => deleteProject(project.id)}>删除</Button>
            ]}>
              <List.Item.Meta
                title={project.name}
                description={project.description}
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default Projects;
