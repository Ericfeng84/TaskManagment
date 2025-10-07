package com.taskmanager.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class ProjectDTO {
    private UUID id;
    private String name;
    private String description;
    private UUID ownerId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserDTO owner;
    private List<ProjectMemberDTO> members;
    private List<TaskDTO> tasks;
    private TaskCountDTO _count;

    public ProjectDTO() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public UUID getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(UUID ownerId) {
        this.ownerId = ownerId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public UserDTO getOwner() {
        return owner;
    }

    public void setOwner(UserDTO owner) {
        this.owner = owner;
    }

    public List<ProjectMemberDTO> getMembers() {
        return members;
    }

    public void setMembers(List<ProjectMemberDTO> members) {
        this.members = members;
    }

    public List<TaskDTO> getTasks() {
        return tasks;
    }

    public void setTasks(List<TaskDTO> tasks) {
        this.tasks = tasks;
    }

    public TaskCountDTO get_count() {
        return _count;
    }

    public void set_count(TaskCountDTO _count) {
        this._count = _count;
    }

    public static class TaskCountDTO {
        private int tasks;

        public TaskCountDTO() {
        }

        public TaskCountDTO(int tasks) {
            this.tasks = tasks;
        }

        public int getTasks() {
            return tasks;
        }

        public void setTasks(int tasks) {
            this.tasks = tasks;
        }
    }
}