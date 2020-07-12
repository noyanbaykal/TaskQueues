import React from 'react';

import '../styles/Queue.css';
import '../styles/gg-trash.css';
import '../styles/gg-pen.css';

function Queue({ queue, onClickDeleteQueue, onClickEditQueue }) {
  const { name, color, id } = queue;

  return (
    <div className='Queue'>
      <div className='colorStripe' style={{ backgroundColor: color }}/>
      <div className='name'>
        {name}
      </div>
      <button onClick={(e) => onClickDeleteQueue(e, id)}>
        <i className="gg-trash"></i>
      </button>
      <button onClick={(e) => onClickEditQueue(e, id)}>
        <i className="gg-pen"></i>
      </button>
    </div>
  );
}

export default Queue;
