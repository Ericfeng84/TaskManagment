# Personal Task Management Assistant - System Diagrams

## System Architecture Overview

```mermaid
graph TB
    subgraph "Client Side"
        A[React Frontend] --> B[React Router]
        A --> C[State Management]
        A --> D[Tailwind CSS]
    end
    
    subgraph "Server Side"
        F[Spring Boot API] --> G[Spring Security]
        F --> I[Controllers]
        F --> J[Services]
        F --> K[Repositories]
        F --> L[JWT Filter]
    end
    
    subgraph "Data Layer"
        M[PostgreSQL Database]
        N[Spring Data JPA]
    end
    
    A --> F
    I --> J
    J --> K
    K --> N
    N --> M
    L --> G
```

## User Flow Diagram

```mermaid
flowchart TD
    A[User visits app] --> B{Is logged in?}
    B -->|No| C[Login/Register Page]
    B -->|Yes| D[Dashboard]
    C --> E[Authentication]
    E --> D
    D --> F[View Projects]
    F --> G[Select Project]
    G --> H[Kanban Board]
    H --> I[View Tasks]
    I --> J[Create/Update Task]
    J --> K[Assign Task]
    K --> L[Update Status]
    L --> M[UI Updates]
```

## Database Relationship Diagram

```mermaid
erDiagram
    Users ||--o{ Projects : owns
    Users ||--o{ ProjectMembers : belongs_to
    Projects ||--o{ ProjectMembers : has
    Projects ||--o{ Tasks : contains
    Users ||--o{ Tasks : creates
    Users ||--o{ Tasks : assigned_to
    
    Users {
        uuid id PK
        string email UK
        string password
        string name
        string avatar
        LocalDateTime createdAt
        LocalDateTime updatedAt
    }
    
    Projects {
        uuid id PK
        string name
        string description
        uuid ownerId FK
        LocalDateTime createdAt
        LocalDateTime updatedAt
    }
    
    Tasks {
        uuid id PK
        string title
        string description
        enum status
        enum priority
        uuid projectId FK
        uuid assigneeId FK
        uuid createdBy FK
        timestamp dueDate
        LocalDateTime createdAt
        LocalDateTime updatedAt
    }
    
    ProjectMembers {
        uuid id PK
        uuid projectId FK
        uuid userId FK
        enum role
        timestamp joinedAt
    }
```

## Component Architecture

```mermaid
graph TD
    A[App] --> B[Router]
    B --> C[Public Routes]
    B --> D[Protected Routes]
    
    C --> E[Login]
    C --> F[Register]
    
    D --> G[Layout]
    G --> H[Header]
    G --> I[Sidebar]
    G --> J[Main Content]
    
    J --> K[Dashboard]
    J --> L[Projects]
    J --> M[ProjectBoard]
    
    M --> N[Board Header]
    M --> O[Kanban Board]
    M --> P[Task Details Modal]
    
    O --> Q[Column: Todo]
    O --> R[Column: In Progress]
    O --> S[Column: Done]
    
    Q --> T[Task Card]
    R --> T
    S --> T
```

## API Request Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant F as JWT Filter
    participant Ctrl as Controller
    participant S as Service
    participant R as Repository
    participant DB as Database
    
    C->>F: HTTP Request with JWT
    F->>F: Validate JWT Token
    F->>Ctrl: Forward Request
    Ctrl->>S: Business Logic
    S->>R: Data Access
    R->>DB: Query/Update Data
    DB-->>R: Response
    R-->>S: Entity Data
    S-->>Ctrl: Processed Data
    Ctrl-->>C: HTTP Response
```

## Data Update Flow

```mermaid
sequenceDiagram
    participant U1 as User 1
    participant C1 as Client 1
    participant API as Spring Boot API
    participant DB as Database
    participant C2 as Client 2
    participant U2 as User 2
    
    U1->>C1: Update Task Status
    C1->>API: PUT /api/tasks/{id}
    API->>DB: Update Task
    DB-->>API: Confirmation
    API-->>C1: Updated Task Data
    C1->>U1: UI Update
    
    Note over C2,U2: Client 2 polls for updates or refreshes
    C2->>API: GET /api/tasks/projects/{projectId}
    API-->>C2: Updated Task List
    C2->>U2: UI Update
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client
    participant A as Auth Controller
    participant S as Auth Service
    participant DB as Database
    
    U->>C: Login Credentials
    C->>A: POST /api/auth/login
    A->>S: Authenticate User
    S->>DB: Verify User
    DB-->>S: User Entity
    S->>S: Generate JWT
    S-->>A: Auth Response with JWT
    A-->>C: JWT Token
    C->>C: Store Token
    
    Note over C,DB: Subsequent Request Flow
    C->>A: Protected Request + JWT
    A->>A: JWT Filter validates token
    A->>A: Set Security Context
    A-->>C: Protected Resource
```

## Project Structure

```mermaid
graph LR
    subgraph "Root Directory"
        A[client/] --> B[React Frontend]
        C[spring-boot-server/] --> D[Spring Boot Backend]
        E[docs/] --> F[Documentation]
        G[.gitignore]
        H[README.md]
    end
    
    subgraph "Client Structure"
        B --> I[src/]
        I --> J[components/]
        I --> K[pages/]
        I --> L[hooks/]
        I --> M[context/]
        I --> N[services/]
        I --> O[types/]
    end
    
    subgraph "Spring Boot Structure"
        D --> P[src/main/java/com/taskmanager/]
        P --> Q[controllers/]
        P --> R[services/]
        P --> S[repositories/]
        P --> T[model/]
        P --> U[dto/]
        P --> V[security/]
        D --> W[src/main/resources/]
        W --> X[application.properties]
        D --> Y[pom.xml]
    end