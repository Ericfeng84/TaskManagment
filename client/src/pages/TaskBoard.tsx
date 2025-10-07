import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Project, Task, User } from '../types';
import { projectsAPI, tasksAPI } from '../services/api';
import TaskCard from '../components/TaskCard';
import DroppableColumn from '../components/DroppableColumn';
import BulkTaskEditor from '../components/BulkTaskEditor';
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
  const [projectMembers, setProjectMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    startDate: '',
    dueDate: '',
    assigneeId: ''
  });
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  const [showBulkEditor, setShowBulkEditor] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  
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

        // Extract project members
        const members = projectResponse.data.members.map((member: any) => member.user);
        setProjectMembers(members);

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
      const taskData = {
        title: newTask.title,
        description: newTask.description,
        priority: 'MEDIUM',
        startDate: newTask.startDate ? new Date(newTask.startDate).toISOString() : null,
        dueDate: newTask.dueDate ? new Date(newTask.dueDate).toISOString() : null,
        assigneeId: newTask.assigneeId || null
      };

      const response = await tasksAPI.createTask(id, taskData);

      setTasks([...tasks, response.data]);
      setNewTask({
        title: '',
        description: '',
        startDate: '',
        dueDate: '',
        assigneeId: ''
      });
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
          description: task.description,
          startDate: task.startDate,
          dueDate: task.dueDate,
          assigneeId: task.assigneeId
        });
        setTasks(tasks.map(task => task.id === taskId ? response.data : task));
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to update task');
    }
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const handleBulkUpdateTasks = (updatedTasks: Task[]) => {
    setTasks(tasks.map(task => {
      const updatedTask = updatedTasks.find(ut => ut.id === task.id);
      return updatedTask || task;
    }));
    setSelectedTasks([]);
    setShowBulkEditor(false);
  };

  const handleTaskSelection = (task: Task, isSelected: boolean) => {
    if (isSelected) {
      setSelectedTasks([...selectedTasks, task]);
    } else {
      setSelectedTasks(selectedTasks.filter(t => t.id !== task.id));
    }
  };

  const handleSelectAllTasks = () => {
    if (selectedTasks.length === tasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks([...tasks]);
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
          description: task.description,
          startDate: task.startDate,
          dueDate: task.dueDate,
          assigneeId: task.assigneeId
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
                onClick={() => setBulkMode(!bulkMode)}
                className={`${bulkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'} text-white font-medium py-2 px-4 rounded`}
              >
                {bulkMode ? '退出批量选择' : '批量选择'}
              </button>
              {bulkMode && (
                <>
                  <button
                    onClick={handleSelectAllTasks}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded"
                  >
                    {selectedTasks.length === tasks.length ? '取消全选' : '全选'}
                  </button>
                  {selectedTasks.length > 0 && (
                    <button
                      onClick={() => setShowBulkEditor(true)}
                      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
                    >
                      批量编辑 ({selectedTasks.length})
                    </button>
                  )}
                </>
              )}
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
                onUpdateTask={handleUpdateTask}
                availableUsers={projectMembers}
                bulkMode={bulkMode}
                selectedTasks={selectedTasks}
                onTaskSelection={handleTaskSelection}
              />

              {/* In Progress Column */}
              <DroppableColumn
                title="In Progress"
                status="IN_PROGRESS"
                tasks={getTasksByStatus('IN_PROGRESS')}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                onUpdateTask={handleUpdateTask}
                availableUsers={projectMembers}
                bulkMode={bulkMode}
                selectedTasks={selectedTasks}
                onTaskSelection={handleTaskSelection}
              />

              {/* Done Column */}
              <DroppableColumn
                title="Done"
                status="DONE"
                tasks={getTasksByStatus('DONE')}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                onUpdateTask={handleUpdateTask}
                availableUsers={projectMembers}
                bulkMode={bulkMode}
                selectedTasks={selectedTasks}
                onTaskSelection={handleTaskSelection}
              />
            </div>
            
            <DragOverlay>
              {activeTask ? (
                <TaskCard
                  task={activeTask}
                  onUpdateStatus={() => {}}
                  onUpdateTask={handleUpdateTask}
                  availableUsers={projectMembers}
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

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  分配给
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={newTask.assigneeId}
                  onChange={(e) => setNewTask({ ...newTask, assigneeId: e.target.value })}
                >
                  <option value="">选择处理人</option>
                  {projectMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    开始日期
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={newTask.startDate}
                    onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    截止日期
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    min={newTask.startDate}
                  />
                </div>
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
      
      {/* 批量编辑器 */}
      {showBulkEditor && (
        <BulkTaskEditor
          selectedTasks={selectedTasks}
          onUpdate={handleBulkUpdateTasks}
          onCancel={() => setShowBulkEditor(false)}
          availableUsers={projectMembers}
        />
      )}
    </div>
  );
};

export default TaskBoard;