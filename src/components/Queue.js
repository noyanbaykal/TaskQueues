import React from 'react';
import '../styles/Queue.css';

function Queue({ name, color }) {
  return (
    <div className='Queue'>
      <div className='colorStripe' style={{ backgroundColor: color }}/>
      <div className='name'>
        {name}
      </div>
    </div>
  );
}

export default Queue;
