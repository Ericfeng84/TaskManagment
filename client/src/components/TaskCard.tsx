import React from 'react';
import { Task } from '../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export {};

interface TaskCardProps {
  task: Task;
  onUpdateStatus: (taskId: string, newStatus: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdateStatus }) => {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${getStatusColor(task.status)} p-4 rounded-lg cursor-move shadow-sm hover:shadow-md transition-shadow`}
      {...attributes}
      {...listeners}
    >
      <h3 className="font-medium text-gray-900">{task.title}</h3>
      {task.description && (
        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
      )}
      <div className="mt-3 flex justify-between">
        <span className="text-xs text-gray-500">
          {task.priority} priority
        </span>
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
  );
};

export default TaskCard;