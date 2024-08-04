// src/pages/Tasks.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { List, Input, Button, Form, Upload, message, Spin } from 'antd';
import { UploadOutlined, PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import './Tasks.css';

const { TextArea } = Input;

const Tasks = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/tasks/${projectId}`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    let attachmentPath = null;
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const uploadResponse = await axios.post('http://localhost:3000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        attachmentPath = uploadResponse.data.path;
      } catch (error) {
        message.error('File upload failed');
        return;
      }
    }

    const taskData = {
      ...values,
      attachment: attachmentPath,
    };

    try {
      const response = await axios.post(`http://localhost:3000/tasks/${projectId}`, taskData);
      setTasks([...tasks, response.data]);
      form.resetFields();
      setFile(null);
      message.success('Task added successfully');
    } catch (error) {
      console.error('Error adding task:', error);
      message.error('Failed to add task');
    }
  };

  const handleFileChange = (info) => {
    setFile(info.file.originFileObj);
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div className="tasks-container">
      <h1 className="title">任务列表</h1>
      <Button
        type="default"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/projects')}
        style={{ marginBottom: '20px' }}
      >
        返回项目列表
      </Button>
      <Form form={form} layout="vertical" onFinish={onFinish} className="task-form">
        <Form.Item name="title" label="任务标题" rules={[{ required: true, message: '请输入任务标题' }]}>
          <Input placeholder="任务标题" />
        </Form.Item>
        <Form.Item name="description" label="任务描述" rules={[{ required: true, message: '请输入任务描述' }]}>
          <TextArea rows={4} placeholder="任务描述" />
        </Form.Item>
        <Form.Item label="附件">
          <Upload beforeUpload={() => false} onChange={handleFileChange}>
            <Button icon={<UploadOutlined />}>上传附件</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>添加任务</Button>
        </Form.Item>
      </Form>

      <List
        header={<div>任务列表</div>}
        bordered
        dataSource={tasks}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={<Link to={`/taskDetails/${item.id}`}>{item.title}</Link>}
              description={(
                <>
                  <p>{item.description}</p>
                </>
              )}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default Tasks;
