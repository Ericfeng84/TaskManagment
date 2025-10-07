# Personal Task Management Assistant - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register a new user
```
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt_token"
}
```

#### Login
```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### Get current user
```
GET /auth/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "avatar": "optional_avatar_url"
}
```

### Projects

#### Get user's projects
```
GET /projects
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Project Name",
    "description": "Project Description",
    "ownerId": "uuid",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z",
    "owner": {
      "id": "uuid",
      "name": "John Doe",
      "email": "user@example.com"
    },
    "_count": {
      "tasks": 5
    }
  }
]
```

#### Create a new project
```
POST /projects
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "New Project",
  "description": "Project Description"
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "New Project",
  "description": "Project Description",
  "ownerId": "uuid",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z",
  "owner": {
    "id": "uuid",
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

#### Get project details
```
GET /projects/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Project Name",
  "description": "Project Description",
  "ownerId": "uuid",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z",
  "owner": {
    "id": "uuid",
    "name": "John Doe",
    "email": "user@example.com"
  },
  "members": [
    {
      "id": "uuid",
      "projectId": "uuid",
      "userId": "uuid",
      "role": "OWNER",
      "joinedAt": "2023-01-01T00:00:00.000Z",
      "user": {
        "id": "uuid",
        "name": "John Doe",
        "email": "user@example.com"
      }
    }
  ],
  "tasks": [
    {
      "id": "uuid",
      "title": "Task Title",
      "description": "Task Description",
      "status": "TODO",
      "priority": "MEDIUM",
      "projectId": "uuid",
      "assigneeId": "uuid",
      "createdBy": "uuid",
      "dueDate": "2023-01-01T00:00:00.000Z",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z",
      "assignee": {
        "id": "uuid",
        "name": "John Doe",
        "email": "user@example.com"
      },
      "creator": {
        "id": "uuid",
        "name": "John Doe",
        "email": "user@example.com"
      }
    }
  ]
}
```

#### Update a project
```
PUT /projects/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Updated Project Name",
  "description": "Updated Project Description"
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Updated Project Name",
  "description": "Updated Project Description",
  "ownerId": "uuid",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z",
  "owner": {
    "id": "uuid",
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

#### Delete a project
```
DELETE /projects/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Project deleted successfully."
}
```

### Tasks

#### Get project tasks
```
GET /tasks/projects/:projectId
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Task Title",
    "description": "Task Description",
    "status": "TODO",
    "priority": "MEDIUM",
    "projectId": "uuid",
    "assigneeId": "uuid",
    "createdBy": "uuid",
    "dueDate": "2023-01-01T00:00:00.000Z",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z",
    "assignee": {
      "id": "uuid",
      "name": "John Doe",
      "email": "user@example.com"
    },
    "creator": {
      "id": "uuid",
      "name": "John Doe",
      "email": "user@example.com"
    }
  }
]
```

#### Create a new task
```
POST /tasks/projects/:projectId
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Task Description",
  "priority": "MEDIUM",
  "assigneeId": "uuid",
  "dueDate": "2023-01-01T00:00:00.000Z"
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "New Task",
  "description": "Task Description",
  "status": "TODO",
  "priority": "MEDIUM",
  "projectId": "uuid",
  "assigneeId": "uuid",
  "createdBy": "uuid",
  "dueDate": "2023-01-01T00:00:00.000Z",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z",
  "assignee": {
    "id": "uuid",
    "name": "John Doe",
    "email": "user@example.com"
  },
  "creator": {
    "id": "uuid",
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

#### Update a task
```
PUT /tasks/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated Task Title",
  "description": "Updated Task Description",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "assigneeId": "uuid",
  "dueDate": "2023-01-01T00:00:00.000Z"
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Updated Task Title",
  "description": "Updated Task Description",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "projectId": "uuid",
  "assigneeId": "uuid",
  "createdBy": "uuid",
  "dueDate": "2023-01-01T00:00:00.000Z",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z",
  "assignee": {
    "id": "uuid",
    "name": "John Doe",
    "email": "user@example.com"
  },
  "creator": {
    "id": "uuid",
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

#### Delete a task
```
DELETE /tasks/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Task deleted successfully."
}
```

## Error Responses

All endpoints may return error responses with the following format:

```json
{
  "error": "Error message describing what went wrong"
}
```

Common HTTP status codes:
- 400: Bad Request - Invalid input data
- 401: Unauthorized - Missing or invalid token
- 404: Not Found - Resource doesn't exist
- 500: Internal Server Error - Server-side error