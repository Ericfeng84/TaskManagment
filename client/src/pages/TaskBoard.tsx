import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Project, Task } from '../types';
import { projectsAPI, tasksAPI } from '../services/api';
import TaskCard from '../components/TaskCard';
import DroppableColumn from '../components/DroppableColumn';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCorners,
} from '@dnd-kit/core';

const TaskBoard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        const projectResponse = await projectsAPI.getProject(id);
        setProject(projectResponse.data);
        
        const tasksResponse = await tasksAPI.getTasks(id);
        setTasks(tasksResponse.data);
      } catch (error: any) {
        setError(error.response?.data?.error || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    try {
      const response = await tasksAPI.createTask(id, {
        title: newTask.title,
        description: newTask.description,
        priority: 'MEDIUM'
      });
      
      setTasks([...tasks, response.data]);
      setNewTask({ title: '', description: '' });
      setShowCreateTask(false);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to create task');
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        const response = await tasksAPI.updateTask(taskId, {
          status: newStatus,
          priority: task.priority,
          title: task.title,
          description: task.description
        });
        setTasks(tasks.map(task => task.id === taskId ? response.data : task));
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to update task');
    }
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveTask(null);
      return;
    }

    const taskId = active.id as string;
    
    // Get the status from the droppable element
    const droppableElement = over.id as string;
    let newStatus = '';
    
    // Check if the drop target is a task card or a droppable area
    if (droppableElement === 'TODO' || droppableElement === 'IN_PROGRESS' || droppableElement === 'DONE') {
      newStatus = droppableElement;
    } else {
      // If dropped on another task, get the status of that task
      const targetTask = tasks.find(t => t.id === droppableElement);
      if (targetTask) {
        newStatus = targetTask.status;
      }
    }
    
    // Check if the status actually changed
    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== newStatus && newStatus) {
      try {
        const response = await tasksAPI.updateTask(taskId, {
          status: newStatus,
          priority: task.priority,
          title: task.title,
          description: task.description
        });
        setTasks(tasks.map(t => t.id === taskId ? response.data : t));
      } catch (error: any) {
        setError(error.response?.data?.error || 'Failed to update task');
      }
    }
    
    setActiveTask(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error || 'Project not found'}
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              {project.description && (
                <p className="text-gray-600 mt-1">{project.description}</p>
              )}
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowCreateTask(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded"
              >
                Add Task
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Todo Column */}
              <DroppableColumn
                title="To Do"
                status="TODO"
                tasks={getTasksByStatus('TODO')}
                onUpdateTaskStatus={handleUpdateTaskStatus}
              />

              {/* In Progress Column */}
              <DroppableColumn
                title="In Progress"
                status="IN_PROGRESS"
                tasks={getTasksByStatus('IN_PROGRESS')}
                onUpdateTaskStatus={handleUpdateTaskStatus}
              />

              {/* Done Column */}
              <DroppableColumn
                title="Done"
                status="DONE"
                tasks={getTasksByStatus('DONE')}
                onUpdateTaskStatus={handleUpdateTaskStatus}
              />
            </div>
            
            <DragOverlay>
              {activeTask ? (
                <TaskCard
                  task={activeTask}
                  onUpdateStatus={() => {}}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </main>

      {/* Create Task Modal */}
      {showCreateTask && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Task</h3>
            <form onSubmit={handleCreateTask}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  rows={3}
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateTask(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;