# Personal Task Management Assistant - Technical Architecture

## Project Overview
A web-based task management application with a kanban-style interface, designed for small teams and individuals to efficiently manage projects and tasks.

## Technology Stack
- **Frontend**: React 18+ with TypeScript
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **Real-time Updates**: Socket.io
- **Styling**: Tailwind CSS
- **State Management**: React Context API + useReducer
- **File Storage**: Local storage (MVP), future: Cloudinary/AWS S3
- **Deployment**: Development: local, Production: Vercel (frontend) + Railway/Heroku (backend)

## Application Architecture

### Frontend Structure
```
client/
├── public/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Buttons, inputs, modals
│   │   ├── auth/           # Login, register forms
│   │   ├── project/        # Project related components
│   │   ├── task/           # Task related components
│   │   └── board/          # Kanban board components
│   ├── pages/              # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Projects.tsx
│   │   └── Board.tsx
│   ├── hooks/              # Custom React hooks
│   ├── context/            # React context providers
│   ├── services/           # API service functions
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── styles/             # Global styles
```

### Backend Structure
```
server/
├── src/
│   ├── controllers/        # Route controllers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── projectController.js
│   │   └── taskController.js
│   ├── middleware/         # Custom middleware
│   │   ├── auth.js
│   │   └── validation.js
│   ├── models/             # Database models (Prisma)
│   ├── routes/             # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── projects.js
│   │   └── tasks.js
│   ├── services/           # Business logic
│   ├── utils/              # Utility functions
│   └── config/             # Configuration files
├── prisma/                 # Database schema and migrations
└── .env                    # Environment variables
```

## Database Schema

### Users Table
```sql
- id: UUID (Primary Key)
- email: String (Unique)
- password: String (Hashed)
- name: String
- avatar: String (Optional)
- createdAt: DateTime
- updatedAt: DateTime
```

### Projects Table
```sql
- id: UUID (Primary Key)
- name: String
- description: String (Optional)
- ownerId: UUID (Foreign Key to Users)
- createdAt: DateTime
- updatedAt: DateTime
```

### Tasks Table
```sql
- id: UUID (Primary Key)
- title: String
- description: String (Optional)
- status: Enum (TODO, IN_PROGRESS, DONE)
- priority: Enum (LOW, MEDIUM, HIGH)
- projectId: UUID (Foreign Key to Projects)
- assigneeId: UUID (Foreign Key to Users, Optional)
- createdBy: UUID (Foreign Key to Users)
- dueDate: DateTime (Optional)
- createdAt: DateTime
- updatedAt: DateTime
```

### ProjectMembers Table (Junction Table)
```sql
- id: UUID (Primary Key)
- projectId: UUID (Foreign Key to Projects)
- userId: UUID (Foreign Key to Users)
- role: Enum (OWNER, MEMBER, VIEWER)
- joinedAt: DateTime
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login
- POST `/api/auth/logout` - User logout
- GET `/api/auth/me` - Get current user info

### Users
- GET `/api/users/:id` - Get user profile
- PUT `/api/users/:id` - Update user profile

### Projects
- GET `/api/projects` - Get user's projects
- POST `/api/projects` - Create new project
- GET `/api/projects/:id` - Get project details
- PUT `/api/projects/:id` - Update project
- DELETE `/api/projects/:id` - Delete project
- GET `/api/projects/:id/members` - Get project members
- POST `/api/projects/:id/members` - Add member to project

### Tasks
- GET `/api/projects/:projectId/tasks` - Get project tasks
- POST `/api/projects/:projectId/tasks` - Create new task
- GET `/api/tasks/:id` - Get task details
- PUT `/api/tasks/:id` - Update task
- DELETE `/api/tasks/:id` - Delete task
- PUT `/api/tasks/:id/status` - Update task status
- PUT `/api/tasks/:id/assignee` - Assign task to user

## Component Hierarchy

### Main Application
```
App
├── Router
│   ├── Public Routes
│   │   ├── Login
│   │   └── Register
│   └── Protected Routes
│       ├── Dashboard
│       ├── Projects
│       └── ProjectBoard
│           ├── Header
│           ├── Board
│           │   ├── Column (Todo, In Progress, Done)
│           │   │   └── TaskCard
│           │   └── AddTaskButton
│           └── Sidebar
│               ├── ProjectInfo
│               └── TeamMembers
```

## State Management

### Authentication Context
- User data
- Authentication status
- Login/logout functions

### Project Context
- Current project
- Project members
- Tasks for current project

### UI Context
- Modal states
- Loading states
- Toast notifications

## Real-time Features

### Socket.io Events
- `task:created` - New task created
- `task:updated` - Task updated
- `task:moved` - Task moved between columns
- `project:member_added` - New member added to project
- `project:updated` - Project details updated

## Security Considerations

### Authentication
- JWT tokens with expiration
- Refresh token mechanism
- Password hashing with bcrypt

### Authorization
- Role-based access control (Owner, Member, Viewer)
- Project-level permissions
- API route protection

### Data Validation
- Input validation on both client and server
- SQL injection prevention with Prisma ORM
- XSS protection with proper sanitization

## Performance Optimizations

### Frontend
- Code splitting with React.lazy
- Memoization with React.memo
- Virtual scrolling for large task lists
- Image optimization

### Backend
- Database query optimization
- API response caching
- Pagination for large datasets
- Database indexing

## Development Workflow

### Environment Setup
1. Clone repository
2. Install dependencies for both client and server
3. Set up PostgreSQL database
4. Configure environment variables
5. Run database migrations
6. Start development servers

### Git Workflow
- Feature branches for new functionality
- Pull requests for code review
- Main branch for production deployments

### Testing Strategy
- Unit tests for utility functions
- Integration tests for API endpoints
- Component tests for React components
- E2E tests for critical user flows

## Future Enhancements

### Phase 2 Features
- File attachments
- Comments on tasks
- Notifications system
- Basic reporting dashboard

### Phase 3 Features
- Advanced analytics
- Time tracking
- Team performance metrics
- Mobile app/PWA