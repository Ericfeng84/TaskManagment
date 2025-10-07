import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import { Task } from '../types';

export {};

interface DroppableColumnProps {
  title: string;
  status: string;
  tasks: Task[];
  onUpdateTaskStatus: (taskId: string, newStatus: string) => void;
  onUpdateTask?: (updatedTask: Task) => void;
  availableUsers?: any[];
  bulkMode?: boolean;
  selectedTasks?: Task[];
  onTaskSelection?: (task: Task, isSelected: boolean) => void;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({
  title,
  status,
  tasks,
  onUpdateTaskStatus,
  onUpdateTask = () => {},
  availableUsers = [],
  bulkMode = false,
  selectedTasks = [],
  onTaskSelection = () => {}
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO':
        return 'bg-white';
      case 'IN_PROGRESS':
        return 'bg-white';
      case 'DONE':
        return 'bg-white';
      default:
        return 'bg-white';
    }
  };

  return (
    <div className={`${getStatusColor(status)} rounded-lg shadow`}>
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
      </div>
      <div 
        ref={setNodeRef}
        className={`p-6 space-y-4 min-h-[200px] ${isOver ? 'bg-gray-50' : ''}`}
      >
        <SortableContext
          items={tasks.map(task => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdateStatus={onUpdateTaskStatus}
              onUpdateTask={onUpdateTask}
              availableUsers={availableUsers}
              bulkMode={bulkMode}
              isSelected={selectedTasks.some(t => t.id === task.id)}
              onSelectionChange={(isSelected) => onTaskSelection(task, isSelected)}
            />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="h-16 w-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
};

export default DroppableColumn;