import React, { useState } from 'react';
import { Container, Paper, Button, TextField, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { v4 as uuidv4 } from 'uuid';

// 初始化数据
const initialData = {
  tasks: {}, // 存储任务
  columns: {}, // 存储列
  columnOrder: [], // 存储列的顺序
};

function App() {
  // 状态管理
  const [state, setState] = useState(initialData);
  const [newColumnName, setNewColumnName] = useState(''); // 新列名称
  const [newTaskContent, setNewTaskContent] = useState(''); // 新任务内容
  const [selectedColumn, setSelectedColumn] = useState(''); // 选中的列

  // 添加新列
  const addColumn = () => {
    const columnId = uuidv4(); // 生成唯一ID
    const newColumn = {
      id: columnId,
      title: newColumnName,
      taskIds: [],
    };

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [columnId]: newColumn,
      },
      columnOrder: [...state.columnOrder, columnId],
    };

    setState(newState);
    setNewColumnName('');
  };

  // 添加新任务
  const addTask = () => {
    const taskId = uuidv4(); // 生成唯一ID
    const newTask = {
      id: taskId,
      content: newTaskContent,
    };

    const column = state.columns[selectedColumn];
    const newTaskIds = [...column.taskIds, taskId];
    const newColumn = {
      ...column,
      taskIds: newTaskIds,
    };

    const newState = {
      ...state,
      tasks: {
        ...state.tasks,
        [taskId]: newTask,
      },
      columns: {
        ...state.columns,
        [newColumn.id]: newColumn,
      },
    };

    setState(newState);
    setNewTaskContent('');
    setSelectedColumn('');
  };

  // 删除列
  const deleteColumn = (columnId) => {
    const newColumns = { ...state.columns };
    delete newColumns[columnId];

    const newColumnOrder = state.columnOrder.filter(id => id !== columnId);

    const newTasks = { ...state.tasks };
    state.columns[columnId].taskIds.forEach(taskId => {
      delete newTasks[taskId];
    });

    const newState = {
      ...state,
      columns: newColumns,
      columnOrder: newColumnOrder,
      tasks: newTasks,
    };

    setState(newState);
  };

  // 删除任务
  const deleteTask = (columnId, taskId) => {
    const column = state.columns[columnId];
    const newTaskIds = column.taskIds.filter(id => id !== taskId);
    const newColumn = {
      ...column,
      taskIds: newTaskIds,
    };

    const newTasks = { ...state.tasks };
    delete newTasks[taskId];

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [columnId]: newColumn,
      },
      tasks: newTasks,
    };

    setState(newState);
  };

  // 移动任务到上一个列
  const moveTaskBackward = (columnId, taskId) => {
    const columnIndex = state.columnOrder.indexOf(columnId);
    if (columnIndex === 0) return; // 已经是第一个列

    const prevColumnId = state.columnOrder[columnIndex - 1];
    const prevColumn = state.columns[prevColumnId];
    const newPrevTaskIds = [...prevColumn.taskIds, taskId];
    const newPrevColumn = {
      ...prevColumn,
      taskIds: newPrevTaskIds,
    };

    const column = state.columns[columnId];
    const newTaskIds = column.taskIds.filter(id => id !== taskId);
    const newColumn = {
      ...column,
      taskIds: newTaskIds,
    };

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [prevColumnId]: newPrevColumn,
        [columnId]: newColumn,
      },
    };

    setState(newState);
  };

  // 移动任务到下一个列
  const moveTaskForward = (columnId, taskId) => {
    const columnIndex = state.columnOrder.indexOf(columnId);
    if (columnIndex === state.columnOrder.length - 1) return; // 已经是最后一个列

    const nextColumnId = state.columnOrder[columnIndex + 1];
    const nextColumn = state.columns[nextColumnId];
    const newNextTaskIds = [...nextColumn.taskIds, taskId];
    const newNextColumn = {
      ...nextColumn,
      taskIds: newNextTaskIds,
    };

    const column = state.columns[columnId];
    const newTaskIds = column.taskIds.filter(id => id !== taskId);
    const newColumn = {
      ...column,
      taskIds: newTaskIds,
    };

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [nextColumnId]: newNextColumn,
        [columnId]: newColumn,
      },
    };

    setState(newState);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Kanban Board</Typography>
      <div>
        <TextField
          label="New column name"
          value={newColumnName}
          onChange={e => setNewColumnName(e.target.value)}
          variant="outlined"
          size="small"
          style={{ marginRight: 8 }}
        />
        <Button variant="contained" color="primary" onClick={addColumn}>Add Column</Button>
      </div>
      <div>
        <TextField
          label="New task content"
          value={newTaskContent}
          onChange={e => setNewTaskContent(e.target.value)}
          variant="outlined"
          size="small"
          style={{ marginRight: 8, marginTop: 16 }}
        />
        <TextField
          select
          label="Select Column"
          value={selectedColumn}
          onChange={e => setSelectedColumn(e.target.value)}
          variant="outlined"
          size="small"
          SelectProps={{
            native: true,
          }}
          style={{ marginRight: 8, marginTop: 16 }}
        >
          <option value="">Select Column</option>
          {state.columnOrder.map(columnId => (
            <option key={columnId} value={columnId}>
              {state.columns[columnId].title}
            </option>
          ))}
        </TextField>
        <Button variant="contained" color="primary" onClick={addTask} style={{ marginTop: 16 }}>Add Task</Button>
      </div>
      <div style={{ display: 'flex', overflowX: 'auto', marginTop: 16 }}>
        {state.columnOrder.map(columnId => {
          const column = state.columns[columnId];
          const tasks = column.taskIds.map(taskId => state.tasks[taskId]);

          return (
            <Paper key={column.id} style={{ padding: 16, margin: 8, backgroundColor: '#f4f5f7', width: 300, position: 'relative' }}>
              <Typography variant="h6">{column.title}</Typography>
              <IconButton size="small" onClick={() => deleteColumn(column.id)} style={{ position: 'absolute', top: 8, right: 8 }}>
                <DeleteIcon />
              </IconButton>
              {tasks.map(task => (
                <Paper key={task.id} style={{ padding: 16, margin: '8px 0', backgroundColor: '#fff', position: 'relative' }}>
                  {task.content}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                    <IconButton size="small" onClick={() => moveTaskBackward(column.id, task.id)}>
                      <ArrowBackIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => moveTaskForward(column.id, task.id)}>
                      <ArrowForwardIcon />
                    </IconButton>
                  </div>
                  <div style={{ position: 'absolute', top: 8, right: 8 }}>
                    <IconButton size="small" onClick={() => deleteTask(column.id, task.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </Paper>
              ))}
            </Paper>
          );
        })}
      </div>
    </Container>
  );
}

export default App;
