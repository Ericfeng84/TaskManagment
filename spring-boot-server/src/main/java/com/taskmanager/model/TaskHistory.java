package com.taskmanager.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "task_history")
public class TaskHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "task_id", nullable = false)
    private UUID taskId;
    
    @Column(name = "field_name", nullable = false)
    private String fieldName;
    
    @Column(name = "old_value", columnDefinition = "TEXT")
    private String oldValue;
    
    @Column(name = "new_value", columnDefinition = "TEXT")
    private String newValue;
    
    @Column(name = "changed_by", nullable = false)
    private UUID changedBy;
    
    @Column(name = "change_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private ChangeType changeType;
    
    @Column(name = "changed_at", nullable = false)
    private LocalDateTime changedAt;
    
    @Column(name = "description")
    private String description;
    
    // Relations
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", insertable = false, updatable = false)
    private Task task;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "changed_by", insertable = false, updatable = false)
    private User changedByUser;
    
    // Constructors
    public TaskHistory() {
    }
    
    public TaskHistory(UUID taskId, String fieldName, String oldValue, String newValue, 
                      UUID changedBy, ChangeType changeType, String description) {
        this.taskId = taskId;
        this.fieldName = fieldName;
        this.oldValue = oldValue;
        this.newValue = newValue;
        this.changedBy = changedBy;
        this.changeType = changeType;
        this.description = description;
        this.changedAt = LocalDateTime.now();
    }
    
    // JPA lifecycle callbacks
    @PrePersist
    protected void onCreate() {
        if (changedAt == null) {
            changedAt = LocalDateTime.now();
        }
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
    
    public Task getTask() {
        return task;
    }
    
    public void setTask(Task task) {
        this.task = task;
    }
    
    public User getChangedByUser() {
        return changedByUser;
    }
    
    public void setChangedByUser(User changedByUser) {
        this.changedByUser = changedByUser;
    }
}