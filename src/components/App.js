import React from 'react';

import QueueList from './QueueList';

import '../styles/App.css';

const HEADER_TEXT = 'Task Queues';

function App() {
  return (
    <div className='App'>
      <div className='topBar'>
        {HEADER_TEXT}
      </div>
      <QueueList />
    </div>
  );
}

export default App;
