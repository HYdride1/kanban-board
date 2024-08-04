// src/pages/TaskDetails.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { List, Input, Button, Form, message, Spin } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

import { UploadOutlined, PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';

import 'antd/dist/reset.css';
import './TaskDetails.css';

const { TextArea } = Input;

const TaskDetails = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTaskDetails();
  }, []);

  const fetchTaskDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/taskDetails/${taskId}`);
      setTask(response.data.task);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Error fetching task details:', error);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      const response = await axios.post(`http://localhost:3000/taskDetails/${taskId}/comments`, values);
      setComments([...comments, response.data]);
      form.resetFields();
      message.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      message.error('Failed to add comment');
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div className="task-details-container">
      <h1 className="title">任务详情</h1>
      <Button
        type="default"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/projects')}
        style={{ marginBottom: '20px' }}
      >
        返回项目列表
      </Button>
      {task && (
        <div className="task-info">
          <h2>{task.title}</h2>
          <p>{task.description}</p>
          {/* {task.attachment && (
            <a href={`http://localhost:3000/tasks/download/${task.attachment}`} target="_blank" rel="noopener noreferrer">
              下载附件
            </a>
          )} */}
        </div>
      )}
      <Form form={form} layout="vertical" onFinish={onFinish} className="comment-form">
        <Form.Item name="comment" label="添加评论" rules={[{ required: true, message: '请输入评论内容' }]}>
          <TextArea rows={4} placeholder="评论内容" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">提交评论</Button>
        </Form.Item>
      </Form>
      <List
        header={<div>评论列表</div>}
        bordered
        dataSource={comments}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              description={item.comment}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default TaskDetails;
