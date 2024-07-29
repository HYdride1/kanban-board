import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Column from './Column';

const Board = () => {
  const [columns, setColumns] = useState([
    {
      id: '1',
      title: '待办',
      cards: [
        { id: '1-1', title: '任务 1', description: '任务描述 1' },
        { id: '1-2', title: '任务 2', description: '任务描述 2' }
      ]
    },
    {
      id: '2',
      title: '进行中',
      cards: [
        { id: '2-1', title: '任务 3', description: '任务描述 3' }
      ]
    },
    {
      id: '3',
      title: '已完成',
      cards: [
        { id: '3-1', title: '任务 4', description: '任务描述 4' }
      ]
    }
  ]);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const sourceColumn = columns.find(column => column.id === source.droppableId);
    const destinationColumn = columns.find(column => column.id === destination.droppableId);

    const sourceItems = Array.from(sourceColumn.cards);
    const [removed] = sourceItems.splice(source.index, 1);

    const destinationItems = Array.from(destinationColumn.cards);
    destinationItems.splice(destination.index, 0, removed);

    setColumns(columns.map(column => {
      if (column.id === source.droppableId) {
        return { ...column, cards: sourceItems };
      } else if (column.id === destination.droppableId) {
        return { ...column, cards: destinationItems };
      } else {
        return column;
      }
    }));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="board">
        {columns.map(column => (
          <Droppable droppableId={column.id} key={column.id}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="column">
                <h2>{column.title}</h2>
                {column.cards.map((card, index) => (
                  <Draggable draggableId={card.id} index={index} key={card.id}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="card"
                      >
                        <h3>{card.title}</h3>
                        <p>{card.description}</p>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default Board;
