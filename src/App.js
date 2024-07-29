import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './styles.css';
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

  return (
    <div>
      <h2>Kanban Board</h2>
      <div>
        <input
          type="text"
          placeholder="New column name"
          value={newColumnName}
          onChange={e => setNewColumnName(e.target.value)}
        />
        <button onClick={addColumn}>Add Column</button>
      </div>
      <div>
        <input
          type="text"
          placeholder="New task content"
          value={newTaskContent}
          onChange={e => setNewTaskContent(e.target.value)}
        />
        <select
          value={selectedColumn}
          onChange={e => setSelectedColumn(e.target.value)}
        >
          <option value="">Select Column</option>
          {state.columnOrder.map(columnId => (
            <option key={columnId} value={columnId}>
              {state.columns[columnId].title}
            </option>
          ))}
        </select>
        <button onClick={addTask}>Add Task</button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        {state.columnOrder.map(columnId => {
          const column = state.columns[columnId];
          const tasks = column.taskIds.map(taskId => state.tasks[taskId]);

          return (
            <Droppable key={column.id} droppableId={column.id}>
              {provided => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="column"
                >
                  <h3>{column.title}</h3>
                  {tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {provided => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="task"
                        >
                          {task.content}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          );
        })}
      </DragDropContext>
    </div>
  );
}

export default App;
