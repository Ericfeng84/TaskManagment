export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  owner: User;
  members: ProjectMember[];
  tasks?: Task[];
  _count?: {
    tasks: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: 'OWNER' | 'MEMBER' | 'VIEWER';
  joinedAt: string;
  user: User;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  projectId: string;
  assigneeId?: string;
  assignee?: User;
  createdBy: string;
  creator: User;
  lastEditedBy?: string;
  lastEditor?: User;
  startDate?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  version?: number;
  tags?: string[];
  customFields?: Record<string, any>;
}

export interface TaskPatch {
  title?: string;
  description?: string;
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  assigneeId?: string;
  startDate?: string;
  dueDate?: string;
  tags?: string[];
  customFields?: Record<string, any>;
}

export interface TaskHistory {
  id: string;
  taskId: string;
  fieldName: string;
  oldValue?: string;
  newValue?: string;
  changedBy: string;
  changedByUser?: User;
  changeType: 'CREATE' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE' | 'ASSIGNMENT_CHANGE' | 'PRIORITY_CHANGE' | 'DUE_DATE_CHANGE' | 'COMMENT_ADDED' | 'ATTACHMENT_ADDED' | 'SUBTASK_ADDED' | 'DEPENDENCY_ADDED';
  changedAt: string;
  description?: string;
}

export interface BulkUpdateRequest {
  taskIds: string[];
  updates: TaskPatch;
}

export interface BulkUpdateResponse {
  successfulUpdates: string[];
  failedUpdates: BulkUpdateError[];
  totalRequested: number;
  totalSuccessful: number;
  totalFailed: number;
}

export interface BulkUpdateError {
  taskId: string;
  errorMessage: string;
  errorCode: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
}