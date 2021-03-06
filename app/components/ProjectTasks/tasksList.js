import React from 'react';

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import propTypes from 'prop-types';
import * as Styled from './styles';

import DateInput from '../../customComponents/DateInput';
import AddButton from '../../customComponents/AddButton';
import CancelButton from '../../customComponents/CancelButton';
import TextInput from '../../customComponents/TextInput';

const TaskActionIconStyle = {
  fontSize: 18,
  display: 'inline-block',
  verticalAlign: 'middle',
  marginLeft: 10,
  cursor: 'pointer',
};

const dateFormat = value => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  if (typeof value === 'string') {
    return new Date(value).toLocaleDateString('en-US', options);
  }

  return value.toLocaleDateString('en-US', options);
};

export default function TaskList({
  projects,
  updateProjectsOrder,
  projectName,
  list,
  updateTask,
  editingTaskCurrently,
  displayAllView,
}) {
  const [editableTaskKey, updateTaskState] = React.useState('');
  const [description, updateTaskDescription] = React.useState('');
  const [scheduledDate, handleTaskScheduledDate] = React.useState(null);

  const editListTask = (key, value) => {
    updateTaskState(key);
    updateTaskDescription(value.description);
    handleTaskScheduledDate(value.scheduledDate);
    editingTaskCurrently(true);
  };

  const candelEditing = () => {
    updateTaskState('');
    editingTaskCurrently(false);
  };

  const updateEditedTask = () => {
    const task = list.find((d, key) => key === editableTaskKey);
    task.description = description;
    task.scheduledDate = scheduledDate;
    const updatedList = [...list];
    updatedList[editableTaskKey] = task;
    updateTask({ projectName, list: updatedList });
    updateTaskState('');
    updateTaskDescription('');
    handleTaskScheduledDate(null);
    editingTaskCurrently(false);
  };

  const deleteTask = index => {
    const updatedList = list.filter((data, key) => index !== key);
    updateTask({ projectName, list: updatedList });
  };

  const onDragStart = (event, data, taskIndex) => {
    event.dataTransfer.setData(
      'taskName',
      JSON.stringify({ taskIndex, data, projectName }),
    );
  };

  const onDragOver = event => {
    event.preventDefault();
  };

  const onDrop = (event, data, taskIndex) => {
    if (!event.dataTransfer.getData('taskName')) {
      event.dataTransfer.clearData();
      return;
    }
    const draggedTask = JSON.parse(event.dataTransfer.getData('taskName'));

    if (draggedTask.projectName === projectName) {
      const newList = [...list];
      newList[taskIndex] = draggedTask.data;
      newList[draggedTask.taskIndex] = data;
      updateTask({ projectName, list: newList });
    } else {
      const updatedProjects = { ...projects };
      updatedProjects[projectName].tasks.unshift(
        projects[draggedTask.projectName].tasks[draggedTask.taskIndex],
      );
      updatedProjects[draggedTask.projectName].tasks.splice(
        draggedTask.taskIndex,
        1,
      );
      updateProjectsOrder(updatedProjects);
    }
    event.dataTransfer.clearData();
  };

  return (
    <Styled.TaskListContainer>
      {list.map((data, key) => (
        <Styled.TaskListItem
          key={`${data.description}`}
          draggable
          onDragOver={event => onDragOver(event)}
          onDrop={event => onDrop(event, data, key)}
          onDragStart={event => onDragStart(event, data, key)}
        >
          {editableTaskKey === key ? (
            <Styled.AddEditInputContainer>
              <div
                style={{
                  display: displayAllView ? 'block' : 'inline-block',
                  verticalAlign: 'middle',
                  width: displayAllView ? '100%' : '80%',
                }}
              >
                <TextInput
                  value={description}
                  onEnter={() => updateEditedTask()}
                  onChange={value => updateTaskDescription(value)}
                />
              </div>
              <div
                style={{
                  display: displayAllView ? 'block' : 'inline-block',
                  verticalAlign: 'middle',
                  width: displayAllView ? '100%' : '20%',
                }}
              >
                <DateInput
                  value={scheduledDate}
                  onChange={value => handleTaskScheduledDate(value)}
                />
              </div>
              <div>
                <AddButton
                  disabled={description.length === 0}
                  onClick={() => updateEditedTask()}
                  style={{ marginRight: '10px' }}
                  name="Update Task"
                />
                <CancelButton onClick={() => candelEditing()} />
              </div>
            </Styled.AddEditInputContainer>
          ) : (
            <div>
              <Styled.DragIcon>
                <DragIndicatorIcon />
              </Styled.DragIcon>

              <Styled.CheckCircle disabled={!data.active} />
              <Styled.TaskDetails>
                <Styled.TaskDescription>
                  {data.description || ''}
                </Styled.TaskDescription>
                <Styled.TaskDescription>
                  {dateFormat(data.scheduledDate)}
                </Styled.TaskDescription>
              </Styled.TaskDetails>

              <Styled.TaskActionsList>
                <EditIcon
                  onClick={() => editListTask(key, data)}
                  style={TaskActionIconStyle}
                />
                <DeleteIcon
                  onClick={() => deleteTask(key)}
                  style={{ ...TaskActionIconStyle, ...{ color: 'red' } }}
                />
              </Styled.TaskActionsList>
            </div>
          )}
        </Styled.TaskListItem>
      ))}
    </Styled.TaskListContainer>
  );
}

TaskList.defaultProp = {
  list: [],
  projects: {},
  updateProjectsOrder: () => {},
  projectName: '',
  updateTask: () => {},
  editingTaskCurrently: () => {},
  displayAllView: false,
};

TaskList.propTypes = {
  list: propTypes.array,
  displayAllView: propTypes.bool,
  projects: propTypes.object,
  updateProjectsOrder: propTypes.func,
  projectName: propTypes.string,
  updateTask: propTypes.func,
  editingTaskCurrently: propTypes.func,
};
