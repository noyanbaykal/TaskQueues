import React from 'react';
import { Container, Divider, Header } from 'semantic-ui-react';

import QueueList from './QueueList';

import '../styles/App.css';

const HEADER_TEXT = 'Task Queues';
const MINOR_OFFSET = '0.1em';

function App() {
  return (
    <div className='App'>
      <Header as='h1' style={{ marginBottom: MINOR_OFFSET, }}>
        {HEADER_TEXT}
      </Header>
      <Divider style={{ marginTop: MINOR_OFFSET, }}/>
      <Container>
        <QueueList />
      </Container>
    </div>
  );
}

export default App;
