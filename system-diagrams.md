# Personal Task Management Assistant - System Diagrams

## System Architecture Overview

```mermaid
graph TB
    subgraph "Client Side"
        A[React Frontend] --> B[React Router]
        A --> C[State Management]
        A --> D[Tailwind CSS]
        A --> E[Socket.io Client]
    end
    
    subgraph "Server Side"
        F[Express.js API] --> G[JWT Authentication]
        F --> H[Socket.io Server]
        F --> I[API Controllers]
        F --> J[Middleware]
    end
    
    subgraph "Data Layer"
        K[PostgreSQL Database]
        L[Prisma ORM]
    end
    
    A --> F
    I --> L
    L --> K
    H --> E
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
    L --> M[Real-time Updates]
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
        timestamp createdAt
        timestamp updatedAt
    }
    
    Projects {
        uuid id PK
        string name
        string description
        uuid ownerId FK
        timestamp createdAt
        timestamp updatedAt
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
        timestamp createdAt
        timestamp updatedAt
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
    participant A as API Gateway
    participant M as Middleware
    participant Ctrl as Controller
    participant S as Service
    participant DB as Database
    
    C->>A: HTTP Request
    A->>M: Authentication Check
    M->>M: Validate JWT Token
    M->>Ctrl: Forward Request
    Ctrl->>S: Business Logic
    S->>DB: Query/Update Data
    DB-->>S: Response
    S-->>Ctrl: Processed Data
    Ctrl-->>A: Formatted Response
    A-->>C: HTTP Response
```

## Real-time Update Flow

```mermaid
sequenceDiagram
    participant U1 as User 1
    participant C1 as Client 1
    participant S as Socket Server
    participant DB as Database
    participant C2 as Client 2
    participant U2 as User 2
    
    U1->>C1: Update Task Status
    C1->>S: Socket Event: task:update
    S->>DB: Update Task
    DB-->>S: Confirmation
    S->>C2: Broadcast: task:updated
    C2->>U2: UI Update
    S-->>C1: Acknowledgment
    C1->>U1: UI Update
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client
    participant A as Auth API
    participant DB as Database
    
    U->>C: Login Credentials
    C->>A: POST /api/auth/login
    A->>DB: Verify User
    DB-->>A: User Data
    A->>A: Generate JWT
    A-->>C: JWT Token
    C->>C: Store Token
    C->>A: Protected Request + JWT
    A->>A: Validate JWT
    A-->>C: Protected Resource
```

## Project Structure

```mermaid
graph LR
    subgraph "Root Directory"
        A[client/] --> B[React Frontend]
        C[server/] --> D[Node.js Backend]
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
    
    subgraph "Server Structure"
        D --> P[src/]
        P --> Q[controllers/]
        P --> R[middleware/]
        P --> S[routes/]
        P --> T[services/]
        D --> U[prisma/]
        D --> V[.env]
    end