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
  onAddTask?: (status: string) => void;
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
  onTaskSelection = () => {},
  onAddTask = () => {}
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div className="bg-gray-50 rounded-xl">
      {/* Column Header */}
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <span className="bg-gray-200 text-gray-600 text-sm font-medium px-2.5 py-1 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Tasks Container */}
      <div
        ref={setNodeRef}
        className={`p-4 pt-0 space-y-4 min-h-[300px] transition-colors ${isOver ? 'bg-gray-100' : ''}`}
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
        
        {tasks.length === 0 && !isOver && (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>No tasks yet.</p>
          </div>
        )}
      </div>

      {/* Add Task Button */}
      <div className="p-4 pt-0">
        <button
          onClick={() => onAddTask(status)}
          className="w-full flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 py-2 rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span className="ml-2 text-sm font-medium">添加任务</span>
        </button>
      </div>
    </div>
  );
};

export default DroppableColumn;