import React from 'react';
import { Header, Divider } from 'semantic-ui-react';

import QueueList from './QueueList';

import '../styles/App.css';

const HEADER_TEXT = 'Task Queues';
const SMALL_OFFSET = '0.1em';

function App() {
  return (
    <div className='App'>
      <Header as='h1' style={{ marginBottom: SMALL_OFFSET, }}>
        {HEADER_TEXT}
      </Header>
      <Divider style={{ marginTop: SMALL_OFFSET, }}/>
      <QueueList />
    </div>
  );
}

export default App;
