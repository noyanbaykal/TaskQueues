import React, { useState } from 'react';
import { Card, Icon } from 'semantic-ui-react';

export function CreateButton({ onCreate }) {
  const BACKGROUND_COLOR = 'rgb(239, 239, 239)';
  const BACKGROUND_COLOR_HOVERED = 'rgb(210, 210, 210)';

  const [color, setColor] = useState(BACKGROUND_COLOR);

  return (
    <Card style={{ textAlign: 'center', boxShadow: 'none'}}>
      <button
        onClick={onCreate}
        style={{ margin: '0 auto', backgroundColor: color }}
        onMouseEnter={() => setColor(BACKGROUND_COLOR_HOVERED)}
        onMouseLeave={() => setColor(BACKGROUND_COLOR)}
      >
        <Icon className='plus circle'/>
      </button>
    </Card>
  );
};
