import React from 'react';
import PropTypes from 'prop-types';

import Task from './Task';

const NO_TASKS = 'You have no pending tasks!';

function TaskList({ taskInfos, queueDropdownOptions, actionCreateTask, actionEditTask, actionDeleteTask, actionCompleteTask }) {
  const getNoTasksMessage = () => {
    return (
      <div style={{ marginBottom: '1em' }}>
        {NO_TASKS}
      </div>
    );
  }

  return (
    <div className='TaskList' style={{ marginRight: '1em' }}>
      { 
        taskInfos.length < 1
        ? 
          <>
            { getNoTasksMessage() }
          </>
        : (
          <div>
            { 
              taskInfos[0].completed &&
                getNoTasksMessage()
            }
            {
              taskInfos.map((taskInfo) => (
                <Task
                  key={`${taskInfo.id}`}
                  taskInfo={taskInfo}
                  queueDropdownOptions={queueDropdownOptions}
                  handleCreate={actionCreateTask}
                  handleEdit={actionEditTask}
                  handleDelete={actionDeleteTask}
                  handleComplete={actionCompleteTask}
                />
              ))
            }
          </div>
          )
      }
      <Task
        queueDropdownOptions={queueDropdownOptions}
        handleCreate={actionCreateTask}
        handleEdit={actionEditTask}
        handleDelete={actionDeleteTask}
        handleComplete={actionCompleteTask}
      />
    </div>
  );
};

TaskList.propTypes = {
  taskInfos: PropTypes.arrayOf(
    PropTypes.shape({
      queueName: PropTypes.string.isRequired,
      queueId: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      completed: PropTypes.bool,
    })
  ).isRequired,
  queueDropdownOptions: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  })).isRequired,
  actionCreateTask: PropTypes.func.isRequired,
  actionEditTask: PropTypes.func.isRequired,
  actionDeleteTask: PropTypes.func.isRequired,
  actionCompleteTask: PropTypes.func.isRequired,
};

export default TaskList;
