# UI Improvement Plan

This document outlines the plan to improve the UI of the project dashboard as per the user's request.

## 1. ProjectCard.tsx Modifications

### 1.1. Display Real Avatars ✅ COMPLETED

The current implementation of `ProjectCard.tsx` uses placeholder images for user avatars. This has been updated to display the initials of the project members.

- **Avatar Rendering Logic**:
  - If a user has an `avatar` URL, it will be used to display their profile picture.
  - If a user does not have an `avatar` URL, their initials will be generated from their `name` and displayed as a fallback.
  - A maximum of 3 avatars will be displayed.
  - If there are more than 3 members, a "+X" indicator will show the remaining count.

**Implementation Details:**
- Created an `Avatar` component that handles both image and initials display
- Added a `getInitials` helper function to extract initials from user names
- Implemented proper member list handling that includes both the project owner and members
- Added visual indicators for additional members beyond the first 3

### 1.2. Task Progress Calculation ✅ MAINTAINED

The task progress is calculated based on the number of completed tasks versus the total number of tasks. This logic is already implemented and has been maintained.

- **Completed Tasks**: `project.tasks?.filter(task => task.status === 'DONE').length || 0`
- **Total Tasks**: `project.tasks?.length || 0`
- **Progress**: `totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0`

## 2. Dashboard.tsx Modifications ✅ NO CHANGES NEEDED

The `Dashboard.tsx` component is responsible for fetching and displaying the list of projects. The existing logic for fetching projects is sufficient as the project data includes the necessary information about members and tasks.

## 3. Server-Side API Modifications

### 3.1. User Model and DTOs ✅ VERIFIED

The server-side User model and UserDTO already support the avatar field:

**User Model** (`spring-boot-server/src/main/java/com/taskmanager/model/User.java`):
```java
@Column(name = "avatar")
private String avatar;
```

**UserDTO** (`spring-boot-server/src/main/java/com/taskmanager/dto/UserDTO.java`):
```java
private String avatar;
```

### 3.2. ProjectService Enhancement ✅ COMPLETED

Updated the `getUserProjects` method in `ProjectService` to include project members with their avatars:

**Changes Made:**
- Added member data population in `getUserProjects` method
- Included avatar field when creating UserDTOs for members
- Ensured both project owner and members are available in the API response

**Code Snippet:**
```java
// Set members with their avatars
List<ProjectMember> members = projectMemberRepository.findByProjectId(project.getId());
List<ProjectMemberDTO> memberDTOs = members.stream().map(member -> {
    // ... member DTO setup ...
    User user = userRepository.findById(member.getUserId()).orElse(null);
    if (user != null) {
        UserDTO userDTO = new UserDTO(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getAvatar() // Avatar included
        );
        memberDTO.setUser(userDTO);
    }
    return memberDTO;
}).collect(Collectors.toList());
projectDTO.setMembers(memberDTOs);
```

## 4. Data Structure Modifications ✅ VERIFIED

The `User` interface in `client/src/types/index.ts` has been reviewed and confirmed to support an optional `avatar` field.

```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}
```

## 5. Implementation Status

- [x] Display real avatars with initials fallback
- [x] Limit display to 3 avatars with count indicator
- [x] Maintain existing task progress calculation
- [x] Verify data structure compatibility
- [x] Update server-side API to include member avatars

The UI improvements have been successfully implemented on both client and server sides. The application now displays real user avatars with initials fallback, and the API properly provides member data including avatar URLs.