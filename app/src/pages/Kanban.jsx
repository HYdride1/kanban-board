// src/pages/Kanban.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, List, Typography, message, Spin, Row, Col, Button } from 'antd';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import 'antd/dist/reset.css';
import './Kanban.css';

const { Title } = Typography;

const ItemType = 'TASK';

const Kanban = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjectsAndTasks();
  }, []);

  const fetchProjectsAndTasks = async () => {
    try {
      const projectResponse = await axios.get('http://localhost:3000/projects');
      setProjects(projectResponse.data.projects);

      const taskResponse = await axios.get('http://localhost:3000/tasks');
      const tasksByProject = taskResponse.data.reduce((acc, task) => {
        if (!acc[task.project_id]) {
          acc[task.project_id] = [];
        }
        acc[task.project_id].push(task);
        return acc;
      }, {});
      setTasks(tasksByProject);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const moveTask = async (taskId, targetProjectId) => {
    try {
      await axios.put(`http://localhost:3000/tasks/${taskId}`, {
        project_id: targetProjectId,
      });
      fetchProjectsAndTasks();
      message.success('Task moved successfully');
    } catch (error) {
      message.error('Failed to move task');
      console.error('Error moving task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:3000/tasks/${taskId}`);
      fetchProjectsAndTasks();
      message.success('Task deleted successfully');
    } catch (error) {
      message.error('Failed to delete task');
      console.error('Error deleting task:', error);
    }
  };

  const Task = ({ task }) => {
    const [, ref] = useDrag({
      type: ItemType,
      item: { id: task.id, projectId: task.project_id },
    });
    return (
      <div ref={ref} className="kanban-task-card">
        <Card
          actions={[
            <DeleteOutlined key="delete" onClick={() => deleteTask(task.id)} />,
          ]}
        >
          <Card.Meta title={task.title} description={task.description} />
        </Card>
      </div>
    );
  };

  const ProjectColumn = ({ project }) => {
    const [, ref] = useDrop({
      accept: ItemType,
      drop: (item) => {
        if (item.projectId !== project.id) {
          moveTask(item.id, project.id);
        }
      },
    });

    return (
      <Col span={8}>
        <div className="kanban-column" ref={ref}>
          <Card title={project.name} className="kanban-column-card">
            <List>
              {tasks[project.id] && tasks[project.id].map((task) => (
                <List.Item key={task.id}>
                  <Task task={task} />
                </List.Item>
              ))}
            </List>
          </Card>
        </div>
      </Col>
    );
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div className="kanban-container">
      <Title level={2} className="kanban-title">任务看板</Title>
      <Button
        type="default"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/projects')}
        style={{ marginBottom: '20px' }}
      >
        返回项目列表
      </Button>
      <DndProvider backend={HTML5Backend}>
        <div className="kanban-board">
          <Row gutter={[16, 16]} justify="center">
            {projects.map(project => (
              <ProjectColumn key={project.id} project={project} />
            ))}
          </Row>
        </div>
      </DndProvider>
    </div>
  );
};

export default Kanban;
