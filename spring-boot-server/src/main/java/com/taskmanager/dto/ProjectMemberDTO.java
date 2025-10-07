package com.taskmanager.dto;

import com.taskmanager.model.MemberRole;
import java.time.LocalDateTime;
import java.util.UUID;

public class ProjectMemberDTO {
    private UUID id;
    private UUID projectId;
    private UUID userId;
    private MemberRole role;
    private LocalDateTime joinedAt;
    private UserDTO user;

    public ProjectMemberDTO() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getProjectId() {
        return projectId;
    }

    public void setProjectId(UUID projectId) {
        this.projectId = projectId;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public MemberRole getRole() {
        return role;
    }

    public void setRole(MemberRole role) {
        this.role = role;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }
}