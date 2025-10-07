package com.taskmanager.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status = TaskStatus.TODO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority = Priority.MEDIUM;

    @Column(name = "project_id", nullable = false)
    private UUID projectId;

    @Column(name = "assignee_id")
    private UUID assigneeId;

    @Column(name = "created_by", nullable = false)
    private UUID createdBy;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "due_date")
    private LocalDateTime dueDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // New fields for enhanced editing functionality
    @Column(name = "version", nullable = false)
    private Integer version = 1;

    @Column(name = "last_edited_by")
    private UUID lastEditedBy;

    // Use JSON format to store tags collection
    @Column(name = "tags", columnDefinition = "TEXT")
    private String tags;

    // Use JSON format to store custom fields
    @Column(name = "custom_fields", columnDefinition = "TEXT")
    private String customFields;

    // Relations
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", insertable = false, updatable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee_id", insertable = false, updatable = false)
    private User assignee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", insertable = false, updatable = false)
    private User creator;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "last_edited_by", insertable = false, updatable = false)
    private User lastEditor;

    // Constructors
    public Task() {
    }

    public Task(String title, String description, TaskStatus status, Priority priority,
                UUID projectId, UUID assigneeId, UUID createdBy, LocalDateTime startDate, LocalDateTime dueDate) {
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.projectId = projectId;
        this.assigneeId = assigneeId;
        this.createdBy = createdBy;
        this.startDate = startDate;
        this.dueDate = dueDate;
    }

    // JPA lifecycle callbacks
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        version += 1;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public UUID getProjectId() {
        return projectId;
    }

    public void setProjectId(UUID projectId) {
        this.projectId = projectId;
    }

    public UUID getAssigneeId() {
        return assigneeId;
    }

    public void setAssigneeId(UUID assigneeId) {
        this.assigneeId = assigneeId;
    }

    public UUID getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UUID createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
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

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public User getAssignee() {
        return assignee;
    }

    public void setAssignee(User assignee) {
        this.assignee = assignee;
    }

    public User getCreator() {
        return creator;
    }

    public void setCreator(User creator) {
        this.creator = creator;
    }

    // New getters and setters for enhanced fields
    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public UUID getLastEditedBy() {
        return lastEditedBy;
    }

    public void setLastEditedBy(UUID lastEditedBy) {
        this.lastEditedBy = lastEditedBy;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public String getCustomFields() {
        return customFields;
    }

    public void setCustomFields(String customFields) {
        this.customFields = customFields;
    }

    public User getLastEditor() {
        return lastEditor;
    }

    public void setLastEditor(User lastEditor) {
        this.lastEditor = lastEditor;
    }

    // Helper methods for tags and custom fields
    public List<String> getTagsList() {
        if (tags == null || tags.isEmpty()) {
            return new ArrayList<>();
        }
        try {
            return new ObjectMapper().readValue(tags, List.class);
        } catch (JsonProcessingException e) {
            return new ArrayList<>();
        }
    }

    public void setTagsList(List<String> tagsList) {
        try {
            this.tags = new ObjectMapper().writeValueAsString(tagsList);
        } catch (JsonProcessingException e) {
            this.tags = "[]";
        }
    }

    public Map<String, Object> getCustomFieldsMap() {
        if (customFields == null || customFields.isEmpty()) {
            return new HashMap<>();
        }
        try {
            return new ObjectMapper().readValue(customFields, Map.class);
        } catch (JsonProcessingException e) {
            return new HashMap<>();
        }
    }

    public void setCustomFieldsMap(Map<String, Object> customFieldsMap) {
        try {
            this.customFields = new ObjectMapper().writeValueAsString(customFieldsMap);
        } catch (JsonProcessingException e) {
            this.customFields = "{}";
        }
    }
}