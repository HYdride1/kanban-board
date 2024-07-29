import React from 'react';
import Card from './Card';

const Column = ({ column }) => {
  return (
    <div className="column">
      <h2>{column.title}</h2>
      {column.cards.map(card => (
        <Card key={card.id} card={card} />
      ))}
    </div>
  );
};

export default Column;
