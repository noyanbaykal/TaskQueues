import React from 'react';

import Task from './Task';
import ConfirmationModal from './ConfirmationModal';

import useTasks from '../logic/useTasks.js';

import '../styles/TaskList.css';
import TaskModal from './TaskModal.js';

const NO_TASKS = 'You have no pending tasks!';
const NO_QUEUES = 'Create a queue before adding tasks!';

function TaskList({ queues, setQueues }) {
  const {
    DELETE_CONFIRMATION,
    showConfirmationModal,
    showTaskModal,
    selectedTaskInfo,
    onClickAddTask,
    onClickEditTask,
    onClickDeleteTask,
    actionTaskModal,
    actionDeleteTask,
    actionCompleteTask,
    getTopTasks,
  } = useTasks(queues, setQueues);

  const topTasks = getTopTasks();

  // TODO: key for tasks should have task index appended!

  return (
    <div className='TaskList'>
      { topTasks.length < 1
        ? <div>{NO_TASKS}</div>
        : (
          <div>
            {
              topTasks.map((task) => (
                <Task
                  key={`${task.queueId}`}
                  task={task}
                  onClickEditTask={onClickEditTask}
                  onClickDeleteTask={onClickDeleteTask}
                  actionCompleteTask={actionCompleteTask}
                />
              ))
            }
          </div>
        )
      }
      { showConfirmationModal &&
          <ConfirmationModal
            prompt={DELETE_CONFIRMATION(selectedTaskInfo.text, selectedTaskInfo.queue.name)}
            onConfirm={() => actionDeleteTask(true)}
            onCancel={() => actionDeleteTask(false)}
          />
      }
      { showTaskModal &&
        <TaskModal
          queueOptions={queues.map(({ name, id }) => ({ name, id }))}
          selectedTaskInfo={selectedTaskInfo}
          onConfirm={actionTaskModal}
          onCancel={() => actionTaskModal()}
        />
      }
      { !showConfirmationModal && !showTaskModal &&
        (
          queues.length < 1
          ? <div>{NO_QUEUES}</div>
          : (
            <button className='addTask' onClick={onClickAddTask}>&#43;</button>
          )
        )
      }
    </div>
  );
};

export default TaskList;
