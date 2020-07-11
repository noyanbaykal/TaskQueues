import React from 'react';
import QueueList from './QueueList';

import '../styles/App.css';

// TODO: remove static test content
const SEED = [
  {
    name: 'TEST1',
    color: '#74992e',
    priority: 1,
    id: 12345774212431232131,
  },
  {
    name: 'TEST2',
    color: '#4287f5',
    priority: 2,
    id: 12315636232112223123,
  },
];

function App() {
  return (
    <div className="App">
      <QueueList queues={SEED} />
    </div>
  );
}

export default App;
