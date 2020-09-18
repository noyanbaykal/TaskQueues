import React from 'react';
import PropTypes from 'prop-types';

import Task, { TASK_NAME } from './Task';

import { getLabelNoPendingObjects } from '../locales/english';

const SMALL_OFFSET = '1em';
const NO_TASKS = getLabelNoPendingObjects(TASK_NAME);

function TaskList({ taskInfos, parentObjectName, queueDropdownOptions, actionCreateTask, actionEditTask, actionDeleteTask, actionCompleteTask }) {
  const getNoTasksMessage = () => {
    return (
      <div style={{ marginBottom: SMALL_OFFSET }}>
        {NO_TASKS}
      </div>
    );
  };

  return (
    <div className='TaskList'>
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
              taskInfos.map((taskInfo, index) => (
                <Task
                  key={`${taskInfo.id}`}
                  taskInfo={taskInfo}
                  index={index + 1}
                  queueDropdownOptions={queueDropdownOptions}
                  handleCreate={actionCreateTask}
                  handleEdit={actionEditTask}
                  handleDelete={actionDeleteTask}
                  handleComplete={actionCompleteTask}
                  parentObjectName={parentObjectName}
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
        parentObjectName={parentObjectName}
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
  parentObjectName: PropTypes.string.isRequired,
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
