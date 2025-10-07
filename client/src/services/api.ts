import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Configure axios defaults
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (email: string, password: string, name: string) =>
    api.post('/auth/register', { email, password, name }),
  
  getMe: () => api.get('/auth/me'),
};

// Projects API
export const projectsAPI = {
  getProjects: () => api.get('/projects'),
  
  createProject: (name: string, description?: string) =>
    api.post('/projects', { name, description }),
  
  getProject: (id: string) => api.get(`/projects/${id}`),

  updateProject: (id: string, name: string, description?: string) =>
    api.put(`/projects/${id}`, { name, description }),

  deleteProject: (id: string) =>
    api.delete(`/projects/${id}`),
};

// Tasks API
export const tasksAPI = {
  getTasks: (projectId: string) =>
    api.get(`/tasks/projects/${projectId}`),
  
  createTask: (projectId: string, taskData: any) =>
    api.post(`/tasks/projects/${projectId}`, taskData),
  
  updateTask: (id: string, taskData: any) =>
    api.put(`/tasks/${id}`, taskData),

  patchTask: (id: string, patchData: any) =>
    api.patch(`/tasks/${id}`, patchData),

  bulkUpdateTasks: (bulkUpdateData: any) =>
    api.post(`/tasks/bulk-update`, bulkUpdateData),

  getTaskHistory: (id: string) =>
    api.get(`/tasks/${id}/history`),

  deleteTask: (id: string) =>
    api.delete(`/tasks/${id}`),
};

export default api;