import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './styles.css';
import { v4 as uuidv4 } from 'uuid';

// 初始数据
const initialData = {
  tasks: {}, // 存储所有任务
  columns: {}, // 存储所有列
  columnOrder: [], // 存储列的顺序
};

function App() {
  const [state, setState] = useState(initialData); // 用于存储看板状态
  const [newColumnName, setNewColumnName] = useState(''); // 新列名输入框的状态
  const [newTaskContent, setNewTaskContent] = useState(''); // 新任务内容输入框的状态
  const [selectedColumn, setSelectedColumn] = useState(''); // 选中的列，用于添加新任务

  // 处理拖放事件
  const onDragEnd = result => {
    const { destination, source, draggableId } = result;

    if (!destination) return; // 如果没有目的地，返回
    if (destination.droppableId === source.droppableId && destination.index === source.index) return; // 如果目的地与起点相同，返回

    const start = state.columns[source.droppableId];
    const finish = state.columns[destination.droppableId];

    // 如果任务在同一列内移动
    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1); // 移除任务
      newTaskIds.splice(destination.index, 0, draggableId); // 插入任务

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

    // 如果任务在不同列间移动
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

    setState(newState); // 更新状态
    setNewColumnName(''); // 清空输入框
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

    setState(newState); // 更新状态
    setNewTaskContent(''); // 清空输入框
    setSelectedColumn(''); // 重置选中的列
  };

  // 删除列
  const deleteColumn = (columnId) => {
    const newColumns = { ...state.columns };
    delete newColumns[columnId];

    const newColumnOrder = state.columnOrder.filter(id => id !== columnId);

    // 删除列下的任务
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

  return (
    <div>
      <h2>Kanban Board</h2>
      {/* 添加列的输入框和按钮 */}
      <div>
        <input
          type="text"
          placeholder="New column name"
          value={newColumnName}
          onChange={e => setNewColumnName(e.target.value)}
        />
        <button onClick={addColumn}>Add Column</button>
      </div>
      {/* 添加任务的输入框、下拉菜单和按钮 */}
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
      {/* 拖放上下文 */}
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
                  <button onClick={() => deleteColumn(column.id)}>Delete Column</button>
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
                          <button onClick={() => deleteTask(column.id, task.id)}>Delete Task</button>
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
