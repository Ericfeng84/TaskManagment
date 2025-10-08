import React, { useState } from 'react';
import { Task } from '../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskEditor from './TaskEditor';

export {};

interface TaskCardProps {
  task: Task;
  onUpdateStatus: (taskId: string, newStatus: string) => void;
  onUpdateTask: (updatedTask: Task) => void;
  availableUsers?: any[];
  bulkMode?: boolean;
  isSelected?: boolean;
  onSelectionChange?: (isSelected: boolean) => void;
}

const PriorityTag: React.FC<{ priority: string }> = ({ priority }) => {
  const getPriorityStyles = () => {
    switch (priority) {
      case 'HIGH':
        return {
          tag: 'bg-red-100 text-red-800',
          text: '高',
          icon: '🚩'
        };
      case 'MEDIUM':
        return {
          tag: 'bg-yellow-100 text-yellow-800',
          text: '中',
          icon: '🚩'
        };
      case 'LOW':
        return {
          tag: 'bg-green-100 text-green-800',
          text: '低',
          icon: '🚩'
        };
      default:
        return {
          tag: 'bg-gray-100 text-gray-800',
          text: '未定',
          icon: '🚩'
        };
    }
  };

  const { tag, text, icon } = getPriorityStyles();

  return (
    <div className={`flex items-center px-2 py-1 rounded-md text-xs font-medium ${tag}`}>
      <span>{icon}</span>
      <span className="ml-1">{text}</span>
    </div>
  );
};

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onUpdateStatus,
  onUpdateTask,
  availableUsers = [],
  bulkMode = false,
  isSelected = false,
  onSelectionChange = () => {}
}) => {
  const [showEditor, setShowEditor] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`relative bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow ${bulkMode ? 'cursor-pointer' : 'cursor-move'} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        {...(bulkMode ? {} : attributes)}
        {...(bulkMode ? {} : listeners)}
        onClick={bulkMode ? () => onSelectionChange(!isSelected) : undefined}
      >
        {/* Checkbox for bulk mode */}
        <div className="absolute top-3 right-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelectionChange(!isSelected)}
            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Task Title and Description */}
        <div className="pr-8">
          <h3 className="font-semibold text-gray-800">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-500 mt-1">{task.description}</p>
          )}
        </div>

        {/* Priority and Edit button */}
        <div className="mt-4 flex justify-between items-center">
          <PriorityTag priority={task.priority} />
          
          {!bulkMode && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowEditor(true);
              }}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Edit task"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* Task Editor Modal */}
      {showEditor && (
        <TaskEditor
          task={task}
          onUpdate={(updatedTask) => {
            onUpdateTask(updatedTask);
            setShowEditor(false);
          }}
          onCancel={() => setShowEditor(false)}
          mode="modal"
          availableUsers={availableUsers}
        />
      )}
    </>
  );
};

export default TaskCard;