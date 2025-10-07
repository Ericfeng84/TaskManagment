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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO':
        return 'bg-gray-50';
      case 'IN_PROGRESS':
        return 'bg-blue-50';
      case 'DONE':
        return 'bg-green-50';
      default:
        return 'bg-gray-50';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && task.status !== 'DONE';
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`${getStatusColor(task.status)} p-4 rounded-lg ${bulkMode ? 'cursor-pointer' : 'cursor-move'} shadow-sm hover:shadow-md transition-shadow ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        {...(bulkMode ? {} : attributes)}
        {...(bulkMode ? {} : listeners)}
        onClick={bulkMode ? () => onSelectionChange(!isSelected) : undefined}
      >
        {bulkMode && (
          <div className="absolute top-2 left-2">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelectionChange(!isSelected)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
        <h3 className="font-medium text-gray-900">{task.title}</h3>
        {task.description && (
          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
        )}

        {/* Dates and Assignee Section */}
        <div className="mt-3 space-y-2">
          {/* Assignee */}
          {task.assignee && (
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  {task.assignee.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-xs text-gray-600 truncate">{task.assignee.name}</span>
            </div>
          )}

          {/* Dates */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              {task.startDate && (
                <div className="flex items-center space-x-1">
                  <span className="text-gray-400">📅</span>
                  <span className="text-gray-500">开始: {formatDate(task.startDate)}</span>
                </div>
              )}
            </div>
            {task.dueDate && (
              <div className={`flex items-center space-x-1 ${isOverdue(task.dueDate) ? 'text-red-500' : 'text-gray-500'}`}>
                <span className={isOverdue(task.dueDate) ? 'text-red-400' : 'text-gray-400'}>⏰</span>
                <span>截止: {formatDate(task.dueDate)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Priority and Status */}
        <div className="mt-3 flex justify-between">
          <span className="text-xs text-gray-500">
            {task.priority} priority
          </span>
          <div className="flex space-x-2">
            {!bulkMode && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEditor(true);
                }}
                className="text-xs text-blue-500 hover:text-blue-700"
              >
                编辑
              </button>
            )}
            <select
              value={task.status}
              onChange={(e) => onUpdateStatus(task.id, e.target.value)}
              className="text-xs border border-gray-300 rounded px-2 py-1"
              onClick={(e) => e.stopPropagation()} // Prevent drag when clicking select
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* 任务编辑器 */}
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