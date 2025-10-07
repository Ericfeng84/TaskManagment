package com.taskmanager.dto;

import com.taskmanager.model.ChangeType;
import java.time.LocalDateTime;
import java.util.UUID;

public class TaskHistoryDTO {
    private UUID id;
    private UUID taskId;
    private String fieldName;
    private String oldValue;
    private String newValue;
    private UUID changedBy;
    private UserDTO changedByUser;
    private ChangeType changeType;
    private LocalDateTime changedAt;
    private String description;

    public TaskHistoryDTO() {
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getTaskId() {
        return taskId;
    }

    public void setTaskId(UUID taskId) {
        this.taskId = taskId;
    }

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public String getOldValue() {
        return oldValue;
    }

    public void setOldValue(String oldValue) {
        this.oldValue = oldValue;
    }

    public String getNewValue() {
        return newValue;
    }

    public void setNewValue(String newValue) {
        this.newValue = newValue;
    }

    public UUID getChangedBy() {
        return changedBy;
    }

    public void setChangedBy(UUID changedBy) {
        this.changedBy = changedBy;
    }

    public UserDTO getChangedByUser() {
        return changedByUser;
    }

    public void setChangedByUser(UserDTO changedByUser) {
        this.changedByUser = changedByUser;
    }

    public ChangeType getChangeType() {
        return changeType;
    }

    public void setChangeType(ChangeType changeType) {
        this.changeType = changeType;
    }

    public LocalDateTime getChangedAt() {
        return changedAt;
    }

    public void setChangedAt(LocalDateTime changedAt) {
        this.changedAt = changedAt;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}