import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Container, Paper, Button, TextField, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';

const initialData = {
  tasks: {},
  columns: {},
  columnOrder: [],
};

function App() {
  const [state, setState] = useState(initialData);
  const [newColumnName, setNewColumnName] = useState('');
  const [newTaskContent, setNewTaskContent] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('');

  const onDragEnd = result => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const start = state.columns[source.droppableId];
    const finish = state.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn,
        },
      };

      setState(newState);
      return;
    }

    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    setState(newState);
  };

  const addColumn = () => {
    const columnId = uuidv4();
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

  const addTask = () => {
    const taskId = uuidv4();
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
      <DragDropContext onDragEnd={onDragEnd}>
        {state.columnOrder.map(columnId => {
          const column = state.columns[columnId];
          const tasks = column.taskIds.map(taskId => state.tasks[taskId]);

          return (
            <Droppable key={column.id} droppableId={column.id}>
              {provided => (
                <Paper
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{ padding: 16, margin: 16, backgroundColor: '#f4f5f7' }}
                >
                  <Typography variant="h6">{column.title}</Typography>
                  <IconButton size="small" onClick={() => deleteColumn(column.id)} style={{ position: 'absolute', top: 8, right: 8 }}>
                    <DeleteIcon />
                  </IconButton>
                  {tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {provided => (
                        <Paper
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{ padding: 16, margin: '8px 0', backgroundColor: '#fff', position: 'relative' }}
                        >
                          {task.content}
                          <IconButton size="small" onClick={() => deleteTask(column.id, task.id)} style={{ position: 'absolute', top: 8, right: 8 }}>
                            <DeleteIcon />
                          </IconButton>
                        </Paper>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Paper>
              )}
            </Droppable>
          );
        })}
      </DragDropContext>
    </Container>
  );
}

export default App;
