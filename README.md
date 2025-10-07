# Personal Task Management Assistant

A web-based task management application with a kanban-style interface, designed for small teams and individuals to efficiently manage projects and tasks.

## Project Overview

This application is built based on the PRD requirements for a personal task management assistant. It provides a clean, intuitive interface for managing projects and tasks with real-time collaboration features.

## Features

### MVP Features
- User authentication (registration, login, logout)
- Project creation and management
- Task creation, assignment, and status tracking
- Kanban-style board for task visualization
- Real-time updates for team collaboration
- Responsive design for desktop and mobile

### Future Features
- File attachments
- Comments on tasks
- Notifications system
- Advanced analytics and reporting
- Time tracking
- Mobile app/PWA

## Technology Stack

- **Frontend**: React 18+ with TypeScript, Tailwind CSS
- **Backend**: Spring Boot with Java
- **Database**: PostgreSQL with JPA/Hibernate
- **Authentication**: JWT tokens
- **Real-time Updates**: Socket.io (planned)
- **Deployment**: Vercel (frontend) + Railway/Heroku (backend)

## Project Structure

```
personal-task-manager/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   ├── services/       # API service functions
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   └── package.json
├── spring-boot-server/     # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/taskmanager/
│   │   │   │   ├── controller/    # REST controllers
│   │   │   │   ├── service/       # Business logic
│   │   │   │   ├── repository/    # JPA repositories
│   │   │   │   ├── model/         # JPA entities
│   │   │   │   ├── dto/           # Data transfer objects
│   │   │   │   └── security/      # Security configuration
│   │   │   └── resources/         # Configuration files
│   │   └── test/
│   └── pom.xml
├── docs/                   # Documentation
│   ├── technical-architecture.md
│   ├── system-diagrams.md
│   └── implementation-guide.md
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Java 17 or higher
- Maven 3.6 or higher
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd personal-task-manager
```

2. Install dependencies:
```bash
npm run install-deps
```

3. Set up environment variables:
```bash
# spring-boot-server/src/main/resources/application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/task_manager
spring.datasource.username=your-username
spring.datasource.password=your-password
jwt.secret=your-super-secret-jwt-key
jwt.expiration=86400000

# client/.env
REACT_APP_API_URL="http://localhost:8080/api"
```

4. Start the development servers:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Project Endpoints
- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create a new project
- `GET /api/projects/:id` - Get project details

### Task Endpoints
- `GET /api/tasks/projects/:projectId` - Get project tasks
- `POST /api/tasks/projects/:projectId` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Development Workflow

1. Create a new feature branch from `main`
2. Implement your changes following the established patterns
3. Test your changes thoroughly
4. Submit a pull request for code review
5. Merge to `main` after approval

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set the build directory to `client`
3. Configure environment variables
4. Deploy

### Backend (Railway/Heroku)
1. Connect your GitHub repository to Railway/Heroku
2. Set up a PostgreSQL database
3. Configure environment variables
4. Deploy

## Contributing

1. Follow the existing code style and patterns
2. Write clear, descriptive commit messages
3. Add tests for new features
4. Update documentation as needed

## License

This project is licensed under the MIT License.

## Documentation

For detailed technical information, please refer to:
- [Technical Architecture](docs/technical-architecture.md)
- [System Diagrams](docs/system-diagrams.md)
- [Implementation Guide](docs/implementation-guide.md)
- [PRD Document](PRD_Core_Prompt.md)