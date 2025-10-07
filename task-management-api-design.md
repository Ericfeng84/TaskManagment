# 任务管理系统API扩展设计

## 1. TaskHistory 模型设计

TaskHistory模型用于记录任务的所有变更历史，包括字段修改、状态变更等。

```java
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
    // (省略getter和setter方法)
}

public enum ChangeType {
    CREATE,
    UPDATE,
    DELETE,
    STATUS_CHANGE,
    ASSIGNMENT_CHANGE,
    PRIORITY_CHANGE,
    DUE_DATE_CHANGE,
    COMMENT_ADDED,
    ATTACHMENT_ADDED,
    SUBTASK_ADDED,
    DEPENDENCY_ADDED
}
```

## 2. TaskVersion 模型设计

TaskVersion模型用于支持任务版本控制，保存任务在不同时间点的完整快照。

```java
@Entity
@Table(name = "task_versions")
public class TaskVersion {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "task_id", nullable = false)
    private UUID taskId;
    
    @Column(name = "version_number", nullable = false)
    private Integer versionNumber;
    
    @Column(name = "title", nullable = false)
    private String title;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TaskStatus status;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    private Priority priority;
    
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
    
    // JSON格式存储扩展字段
    @Column(name = "tags", columnDefinition = "TEXT")
    private String tags;
    
    @Column(name = "custom_fields", columnDefinition = "TEXT")
    private String customFields;
    
    @Column(name = "version_created_by", nullable = false)
    private UUID versionCreatedBy;
    
    @Column(name = "version_created_at", nullable = false)
    private LocalDateTime versionCreatedAt;
    
    @Column(name = "change_summary", columnDefinition = "TEXT")
    private String changeSummary;
    
    // Relations
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", insertable = false, updatable = false)
    private Task task;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "version_created_by", insertable = false, updatable = false)
    private User versionCreator;
    
    // Constructors
    public TaskVersion() {
    }
    
    public TaskVersion(UUID taskId, Integer versionNumber, String title, String description,
                      TaskStatus status, Priority priority, UUID projectId, UUID assigneeId,
                      UUID createdBy, LocalDateTime startDate, LocalDateTime dueDate,
                      String tags, String customFields, UUID versionCreatedBy, String changeSummary) {
        this.taskId = taskId;
        this.versionNumber = versionNumber;
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.projectId = projectId;
        this.assigneeId = assigneeId;
        this.createdBy = createdBy;
        this.startDate = startDate;
        this.dueDate = dueDate;
        this.tags = tags;
        this.customFields = customFields;
        this.versionCreatedBy = versionCreatedBy;
        this.changeSummary = changeSummary;
        this.versionCreatedAt = LocalDateTime.now();
    }
    
    // JPA lifecycle callbacks
    @PrePersist
    protected void onCreate() {
        if (versionCreatedAt == null) {
            versionCreatedAt = LocalDateTime.now();
        }
    }
    
    // Getters and Setters
    // (省略getter和setter方法)
}
```

## 3. 扩展的Task模型设计

扩展原有的Task模型，添加新的字段。

```java
@Entity
@Table(name = "tasks")
public class Task {
    // 原有字段保持不变
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
    
    // 新增字段
    @Column(name = "version", nullable = false)
    private Integer version = 1;
    
    @Column(name = "last_edited_by")
    private UUID lastEditedBy;
    
    // 使用JSON格式存储标签集合
    @Column(name = "tags", columnDefinition = "TEXT")
    private String tags;
    
    // 使用JSON格式存储自定义字段
    @Column(name = "custom_fields", columnDefinition = "TEXT")
    private String customFields;
    
    // 原有关系保持不变
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
    
    // 新增关系
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TaskHistory> editHistory = new ArrayList<>();
    
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TaskVersion> versions = new ArrayList<>();
    
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TaskComment> comments = new ArrayList<>();
    
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TaskAttachment> attachments = new ArrayList<>();
    
    @OneToMany(mappedBy = "parentTask", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<SubTask> subtasks = new ArrayList<>();
    
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TimeTracking> timeTracking = new ArrayList<>();
    
    @OneToMany(mappedBy = "sourceTask", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TaskDependency> dependencies = new ArrayList<>();
    
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
    
    // 辅助方法
    public List<String> getTagsList() {
        if (tags == null || tags.isEmpty()) {
            return new ArrayList<>();
        }
        try {
            return new ObjectMapper().readValue(tags, List.class);
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }
    
    public void setTagsList(List<String> tagsList) {
        try {
            this.tags = new ObjectMapper().writeValueAsString(tagsList);
        } catch (Exception e) {
            this.tags = "[]";
        }
    }
    
    public Map<String, Object> getCustomFieldsMap() {
        if (customFields == null || customFields.isEmpty()) {
            return new HashMap<>();
        }
        try {
            return new ObjectMapper().readValue(customFields, Map.class);
        } catch (Exception e) {
            return new HashMap<>();
        }
    }
    
    public void setCustomFieldsMap(Map<String, Object> customFieldsMap) {
        try {
            this.customFields = new ObjectMapper().writeValueAsString(customFieldsMap);
        } catch (Exception e) {
            this.customFields = "{}";
        }
    }
    
    // 原有getter和setter方法保持不变
    // 新增字段的getter和setter方法
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
    
    public List<TaskHistory> getEditHistory() {
        return editHistory;
    }
    
    public void setEditHistory(List<TaskHistory> editHistory) {
        this.editHistory = editHistory;
    }
    
    public List<TaskVersion> getVersions() {
        return versions;
    }
    
    public void setVersions(List<TaskVersion> versions) {
        this.versions = versions;
    }
    
    public List<TaskComment> getComments() {
        return comments;
    }
    
    public void setComments(List<TaskComment> comments) {
        this.comments = comments;
    }
    
    public List<TaskAttachment> getAttachments() {
        return attachments;
    }
    
    public void setAttachments(List<TaskAttachment> attachments) {
        this.attachments = attachments;
    }
    
    public List<SubTask> getSubtasks() {
        return subtasks;
    }
    
    public void setSubtasks(List<SubTask> subtasks) {
        this.subtasks = subtasks;
    }
    
    public List<TimeTracking> getTimeTracking() {
        return timeTracking;
    }
    
    public void setTimeTracking(List<TimeTracking> timeTracking) {
        this.timeTracking = timeTracking;
    }
    
    public List<TaskDependency> getDependencies() {
        return dependencies;
    }
    
    public void setDependencies(List<TaskDependency> dependencies) {
        this.dependencies = dependencies;
    }
    
    public User getLastEditor() {
        return lastEditor;
    }
    
    public void setLastEditor(User lastEditor) {
        this.lastEditor = lastEditor;
    }
}
## 4. 评论相关模型设计

```java
@Entity
@Table(name = "task_comments")
public class TaskComment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "task_id", nullable = false)
    private UUID taskId;
    
    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;
    
    @Column(name = "author_id", nullable = false)
    private UUID authorId;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "parent_comment_id")
    private UUID parentCommentId;
    
    // Relations
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", insertable = false, updatable = false)
    private Task task;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", insertable = false, updatable = false)
    private User author;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_comment_id", insertable = false, updatable = false)
    private TaskComment parentComment;
    
    @OneToMany(mappedBy = "parentComment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TaskComment> replies = new ArrayList<>();
    
    // Constructors
    public TaskComment() {
    }
    
    public TaskComment(UUID taskId, String content, UUID authorId, UUID parentCommentId) {
        this.taskId = taskId;
        this.content = content;
        this.authorId = authorId;
        this.parentCommentId = parentCommentId;
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
    }
    
    // Getters and Setters
    // (省略getter和setter方法)
}
```

## 5. 附件相关模型设计

```java
@Entity
@Table(name = "task_attachments")
public class TaskAttachment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "task_id", nullable = false)
    private UUID taskId;
    
    @Column(name = "file_name", nullable = false)
    private String fileName;
    
    @Column(name = "original_name", nullable = false)
    private String originalName;
    
    @Column(name = "file_path", nullable = false)
    private String filePath;
    
    @Column(name = "file_size", nullable = false)
    private Long fileSize;
    
    @Column(name = "content_type")
    private String contentType;
    
    @Column(name = "uploaded_by", nullable = false)
    private UUID uploadedBy;
    
    @Column(name = "uploaded_at", nullable = false, updatable = false)
    private LocalDateTime uploadedAt;
    
    @Column(name = "description")
    private String description;
    
    // Relations
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", insertable = false, updatable = false)
    private Task task;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by", insertable = false, updatable = false)
    private User uploader;
    
    // Constructors
    public TaskAttachment() {
    }
    
    public TaskAttachment(UUID taskId, String fileName, String originalName, 
                         String filePath, Long fileSize, String contentType, 
                         UUID uploadedBy, String description) {
        this.taskId = taskId;
        this.fileName = fileName;
        this.originalName = originalName;
        this.filePath = filePath;
        this.fileSize = fileSize;
        this.contentType = contentType;
        this.uploadedBy = uploadedBy;
        this.description = description;
    }
    
    // JPA lifecycle callbacks
    @PrePersist
    protected void onCreate() {
        uploadedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    // (省略getter和setter方法)
}
```

## 6. 子任务相关模型设计

```java
@Entity
@Table(name = "subtasks")
public class SubTask {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "parent_task_id", nullable = false)
    private UUID parentTaskId;
    
    @Column(name = "title", nullable = false)
    private String title;
    
    @Column(name = "description")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TaskStatus status = TaskStatus.TODO;
    
    @Column(name = "assignee_id")
    private UUID assigneeId;
    
    @Column(name = "created_by", nullable = false)
    private UUID createdBy;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "due_date")
    private LocalDateTime dueDate;
    
    @Column(name = "order_index")
    private Integer orderIndex;
    
    // Relations
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_task_id", insertable = false, updatable = false)
    private Task parentTask;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee_id", insertable = false, updatable = false)
    private User assignee;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", insertable = false, updatable = false)
    private User creator;
    
    // Constructors
    public SubTask() {
    }
    
    public SubTask(UUID parentTaskId, String title, String description, TaskStatus status,
                  UUID assigneeId, UUID createdBy, LocalDateTime dueDate, Integer orderIndex) {
        this.parentTaskId = parentTaskId;
        this.title = title;
        this.description = description;
        this.status = status;
        this.assigneeId = assigneeId;
        this.createdBy = createdBy;
        this.dueDate = dueDate;
        this.orderIndex = orderIndex;
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
    }
    
    // Getters and Setters
    // (省略getter和setter方法)
}
```

## 7. 时间跟踪相关模型设计

```java
@Entity
@Table(name = "time_tracking")
public class TimeTracking {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "task_id", nullable = false)
    private UUID taskId;
    
    @Column(name = "user_id", nullable = false)
    private UUID userId;
    
    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;
    
    @Column(name = "end_time")
    private LocalDateTime endTime;
    
    @Column(name = "duration_minutes")
    private Integer durationMinutes;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Relations
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", insertable = false, updatable = false)
    private Task task;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;
    
    // Constructors
    public TimeTracking() {
    }
    
    public TimeTracking(UUID taskId, UUID userId, LocalDateTime startTime, 
                       LocalDateTime endTime, String description) {
        this.taskId = taskId;
        this.userId = userId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.description = description;
        calculateDuration();
    }
    
    // JPA lifecycle callbacks
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        calculateDuration();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        calculateDuration();
    }
    
    // Business methods
    private void calculateDuration() {
        if (startTime != null && endTime != null) {
            durationMinutes = (int) java.time.Duration.between(startTime, endTime).toMinutes();
        }
    }
    
    // Getters and Setters
    // (省略getter和setter方法)
}
```

## 8. 依赖关系相关模型设计

```java
@Entity
@Table(name = "task_dependencies")
public class TaskDependency {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "source_task_id", nullable = false)
    private UUID sourceTaskId;
    
    @Column(name = "target_task_id", nullable = false)
    private UUID targetTaskId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "dependency_type", nullable = false)
    private DependencyType dependencyType;
    
    @Column(name = "created_by", nullable = false)
    private UUID createdBy;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "description")
    private String description;
    
    // Relations
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_task_id", insertable = false, updatable = false)
    private Task sourceTask;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_task_id", insertable = false, updatable = false)
    private Task targetTask;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", insertable = false, updatable = false)
    private User creator;
    
    // Constructors
    public TaskDependency() {
    }
    
    public TaskDependency(UUID sourceTaskId, UUID targetTaskId, DependencyType dependencyType,
                         UUID createdBy, String description) {
        this.sourceTaskId = sourceTaskId;
        this.targetTaskId = targetTaskId;
        this.dependencyType = dependencyType;
        this.createdBy = createdBy;
        this.description = description;
    }
    
    // JPA lifecycle callbacks
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    // (省略getter和setter方法)
}

public enum DependencyType {
    FINISH_TO_START,  // 源任务完成后，目标任务才能开始
    START_TO_START,   // 源任务开始后，目标任务才能开始
    FINISH_TO_FINISH, // 源任务完成后，目标任务才能完成
    START_TO_FINISH   // 源任务开始后，目标任务才能完成
}
```

## 9. 自定义字段相关模型设计

```java
@Entity
@Table(name = "custom_fields")
public class CustomField {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "project_id", nullable = false)
    private UUID projectId;
    
    @Column(name = "field_name", nullable = false)
    private String fieldName;
    
    @Column(name = "field_label", nullable = false)
    private String fieldLabel;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "field_type", nullable = false)
    private CustomFieldType fieldType;
    
    @Column(name = "is_required", nullable = false)
    private Boolean isRequired = false;
    
    @Column(name = "default_value")
    private String defaultValue;
    
    @Column(name = "options", columnDefinition = "TEXT")
    private String options;
    
    @Column(name = "created_by", nullable = false)
    private UUID createdBy;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Relations
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", insertable = false, updatable = false)
    private Project project;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", insertable = false, updatable = false)
    private User creator;
    
    // Constructors
    public CustomField() {
    }
    
    public CustomField(UUID projectId, String fieldName, String fieldLabel, 
                      CustomFieldType fieldType, Boolean isRequired, 
                      String defaultValue, String options, UUID createdBy) {
        this.projectId = projectId;
        this.fieldName = fieldName;
        this.fieldLabel = fieldLabel;
        this.fieldType = fieldType;
        this.isRequired = isRequired;
        this.defaultValue = defaultValue;
        this.options = options;
        this.createdBy = createdBy;
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
    }
    
    // Getters and Setters
    // (省略getter和setter方法)
}

@Entity
@Table(name = "task_custom_field_values")
public class TaskCustomFieldValue {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "task_id", nullable = false)
    private UUID taskId;
    
    @Column(name = "custom_field_id", nullable = false)
    private UUID customFieldId;
    
    @Column(name = "field_value", columnDefinition = "TEXT")
    private String fieldValue;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Relations
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", insertable = false, updatable = false)
    private Task task;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "custom_field_id", insertable = false, updatable = false)
    private CustomField customField;
    
    // Constructors
    public TaskCustomFieldValue() {
    }
    
    public TaskCustomFieldValue(UUID taskId, UUID customFieldId, String fieldValue) {
        this.taskId = taskId;
        this.customFieldId = customFieldId;
        this.fieldValue = fieldValue;
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
    }
    
    // Getters and Setters
    // (省略getter和setter方法)
}

public enum CustomFieldType {
    TEXT,
    NUMBER,
    DATE,
    BOOLEAN,
    SELECT,
    MULTI_SELECT,
    URL,
    EMAIL
}
```

## 10. DTO类设计

### 10.1 扩展的TaskDTO

```java
public class TaskDTO {
    // 原有字段
    private UUID id;
    private String title;
    private String description;
    private TaskStatus status;
    private Priority priority;
    private UUID projectId;
    private UUID assigneeId;
    private UUID createdBy;
    private LocalDateTime startDate;
    private LocalDateTime dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserDTO assignee;
    private UserDTO creator;
    
    // 新增字段
    private Integer version;
    private UUID lastEditedBy;
    private UserDTO lastEditor;
    private List<String> tags;
    private Map<String, Object> customFields;
    private List<TaskCommentDTO> comments;
    private List<TaskAttachmentDTO> attachments;
    private List<SubTaskDTO> subtasks;
    private List<TimeTrackingDTO> timeTracking;
    private List<TaskDependencyDTO> dependencies;
    
    // 构造函数、getter和setter方法
    // (省略)
}
```

### 10.2 TaskHistoryDTO

```java
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
    
    // 构造函数、getter和setter方法
    // (省略)
}
```

### 10.3 TaskVersionDTO

```java
public class TaskVersionDTO {
    private UUID id;
    private UUID taskId;
    private Integer versionNumber;
    private String title;
    private String description;
    private TaskStatus status;
    private Priority priority;
    private UUID projectId;
    private UUID assigneeId;
    private UUID createdBy;
    private LocalDateTime startDate;
    private LocalDateTime dueDate;
    private List<String> tags;
    private Map<String, Object> customFields;
    private UUID versionCreatedBy;
    private UserDTO versionCreator;
    private LocalDateTime versionCreatedAt;
    private String changeSummary;
    
    // 构造函数、getter和setter方法
    // (省略)
}
```

### 10.4 TaskCommentDTO

```java
public class TaskCommentDTO {
    private UUID id;
    private UUID taskId;
    private String content;
    private UUID authorId;
    private UserDTO author;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UUID parentCommentId;
    private List<TaskCommentDTO> replies;
    
    // 构造函数、getter和setter方法
    // (省略)
}
```

### 10.5 TaskAttachmentDTO

```java
public class TaskAttachmentDTO {
    private UUID id;
    private UUID taskId;
    private String fileName;
    private String originalName;
    private String filePath;
    private Long fileSize;
    private String contentType;
    private UUID uploadedBy;
    private UserDTO uploader;
    private LocalDateTime uploadedAt;
    private String description;
    
    // 构造函数、getter和setter方法
    // (省略)
}
```

### 10.6 SubTaskDTO

```java
public class SubTaskDTO {
    private UUID id;
    private UUID parentTaskId;
    private String title;
    private String description;
    private TaskStatus status;
    private UUID assigneeId;
    private UserDTO assignee;
    private UUID createdBy;
    private UserDTO creator;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime dueDate;
    private Integer orderIndex;
    
    // 构造函数、getter和setter方法
    // (省略)
}
```

### 10.7 TimeTrackingDTO

```java
public class TimeTrackingDTO {
    private UUID id;
    private UUID taskId;
    private UUID userId;
    private UserDTO user;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer durationMinutes;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // 构造函数、getter和setter方法
    // (省略)
}
```

### 10.8 TaskDependencyDTO

```java
public class TaskDependencyDTO {
    private UUID id;
    private UUID sourceTaskId;
    private UUID targetTaskId;
    private DependencyType dependencyType;
    private UUID createdBy;
    private UserDTO creator;
    private LocalDateTime createdAt;
    private String description;
    
    // 构造函数、getter和setter方法
    // (省略)
}
```

### 10.9 CustomFieldDTO

```java
public class CustomFieldDTO {
    private UUID id;
    private UUID projectId;
    private String fieldName;
    private String fieldLabel;
    private CustomFieldType fieldType;
    private Boolean isRequired;
    private String defaultValue;
    private List<String> options;
    private UUID createdBy;
    private UserDTO creator;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // 构造函数、getter和setter方法
    // (省略)
}
```

### 10.10 TaskPatchDTO (部分更新请求DTO)

```java
public class TaskPatchDTO {
    private String title;
    private String description;
    private TaskStatus status;
    private Priority priority;
    private UUID assigneeId;
    private LocalDateTime startDate;
    private LocalDateTime dueDate;
    private List<String> tags;
    private Map<String, Object> customFields;
    
    // 构造函数、getter和setter方法
    // (省略)
}
```

### 10.11 BulkUpdateRequest (批量更新请求DTO)

```java
public class BulkUpdateRequest {
    private List<UUID> taskIds;
    private TaskPatchDTO updates;
    
    // 构造函数、getter和setter方法
    // (省略)
}
```

### 10.12 BulkUpdateResponse (批量更新响应DTO)

```java
public class BulkUpdateResponse {
    private List<UUID> successfulUpdates;
    private List<BulkUpdateError> failedUpdates;
    private Integer totalRequested;
    private Integer totalSuccessful;
    private Integer totalFailed;
    
    // 构造函数、getter和setter方法
    // (省略)
}

public class BulkUpdateError {
    private UUID taskId;
    private String errorMessage;
    private String errorCode;
    
    // 构造函数、getter和setter方法
    // (省略)
}
```

### 10.13 CommentRequest (评论请求DTO)

```java
public class CommentRequest {
    private String content;
    private UUID parentCommentId;
    
    // 构造函数、getter和setter方法
    // (省略)
}
```

### 10.14 AttachmentRequest (附件请求DTO)

```java
public class AttachmentRequest {
    private String description;
    
    // 构造函数、getter和setter方法
    // (省略)
}
```

## 11. API接口设计

### 11.1 任务管理接口

#### 11.1.1 部分更新任务

```
PATCH /api/tasks/{id}
Content-Type: application/json
Authorization: Bearer {token}

Request Body:
{
  "title": "Updated task title",
  "description": "Updated description",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "assigneeId": "uuid-of-assignee",
  "startDate": "2023-06-01T09:00:00",
  "dueDate": "2023-06-15T18:00:00",
  "tags": ["urgent", "frontend"],
  "customFields": {
    "complexity": "high",
    "estimatedHours": 40
  }
}

Response:
Status: 200 OK
Content-Type: application/json

{
  "id": "task-uuid",
  "title": "Updated task title",
  "description": "Updated description",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "projectId": "project-uuid",
  "assigneeId": "assignee-uuid",
  "createdBy": "creator-uuid",
  "lastEditedBy": "editor-uuid",
  "startDate": "2023-06-01T09:00:00",
  "dueDate": "2023-06-15T18:00:00",
  "createdAt": "2023-05-20T10:00:00",
  "updatedAt": "2023-06-01T11:30:00",
  "version": 2,
  "tags": ["urgent", "frontend"],
  "customFields": {
    "complexity": "high",
    "estimatedHours": 40
  },
  "assignee": {
    "id": "assignee-uuid",
    "email": "assignee@example.com",
    "name": "John Doe",
    "avatar": "avatar-url"
  },
  "creator": {
    "id": "creator-uuid",
    "email": "creator@example.com",
    "name": "Jane Smith",
    "avatar": "avatar-url"
  },
  "lastEditor": {
    "id": "editor-uuid",
    "email": "editor@example.com",
    "name": "Bob Johnson",
    "avatar": "avatar-url"
  }
}
```

#### 11.1.2 批量更新任务

```
POST /api/tasks/bulk-update
Content-Type: application/json
Authorization: Bearer {token}

Request Body:
{
  "taskIds": ["task-uuid-1", "task-uuid-2", "task-uuid-3"],
  "updates": {
    "status": "DONE",
    "priority": "MEDIUM",
    "tags": ["completed"]
  }
}

Response:
Status: 200 OK
Content-Type: application/json

{
  "successfulUpdates": ["task-uuid-1", "task-uuid-2"],
  "failedUpdates": [
    {
      "taskId": "task-uuid-3",
      "errorMessage": "Task not found or access denied",
      "errorCode": "TASK_NOT_FOUND"
    }
  ],
  "totalRequested": 3,
  "totalSuccessful": 2,
  "totalFailed": 1
}
```

#### 11.1.3 获取任务编辑历史

```
GET /api/tasks/{id}/history
Authorization: Bearer {token}

Response:
Status: 200 OK
Content-Type: application/json

{
  "history": [
    {
      "id": "history-uuid-1",
      "taskId": "task-uuid",
      "fieldName": "status",
      "oldValue": "TODO",
      "newValue": "IN_PROGRESS",
      "changedBy": "user-uuid",
      "changedByUser": {
        "id": "user-uuid",
        "email": "user@example.com",
        "name": "John Doe",
        "avatar": "avatar-url"
      },
      "changeType": "STATUS_CHANGE",
      "changedAt": "2023-06-01T10:30:00",
      "description": "Changed status from TODO to IN_PROGRESS"
    },
    {
      "id": "history-uuid-2",
      "taskId": "task-uuid",
      "fieldName": "assignee",
      "oldValue": "old-assignee-uuid",
      "newValue": "new-assignee-uuid",
      "changedBy": "user-uuid",
      "changedByUser": {
        "id": "user-uuid",
        "email": "user@example.com",
        "name": "John Doe",
        "avatar": "avatar-url"
      },
      "changeType": "ASSIGNMENT_CHANGE",
      "changedAt": "2023-06-01T11:15:00",
      "description": "Reassigned task to new team member"
    }
  ],
  "totalElements": 2,
  "totalPages": 1,
  "size": 20,
  "number": 0
}
```

#### 11.1.4 获取任务版本列表

```
GET /api/tasks/{id}/versions
Authorization: Bearer {token}

Response:
Status: 200 OK
Content-Type: application/json

{
  "versions": [
    {
      "id": "version-uuid-1",
      "taskId": "task-uuid",
      "versionNumber": 1,
      "title": "Original task title",
      "description": "Original description",
      "status": "TODO",
      "priority": "MEDIUM",
      "projectId": "project-uuid",
      "assigneeId": "original-assignee-uuid",
      "createdBy": "creator-uuid",
      "startDate": "2023-05-20T09:00:00",
      "dueDate": "2023-06-10T18:00:00",
      "tags": ["original-tag"],
      "customFields": {
        "originalField": "value"
      },
      "versionCreatedBy": "creator-uuid",
      "versionCreator": {
        "id": "creator-uuid",
        "email": "creator@example.com",
        "name": "Jane Smith",
        "avatar": "avatar-url"
      },
      "versionCreatedAt": "2023-05-20T10:00:00",
      "changeSummary": "Initial version"
    },
    {
      "id": "version-uuid-2",
      "taskId": "task-uuid",
      "versionNumber": 2,
      "title": "Updated task title",
      "description": "Updated description",
      "status": "IN_PROGRESS",
      "priority": "HIGH",
      "projectId": "project-uuid",
      "assigneeId": "new-assignee-uuid",
      "createdBy": "creator-uuid",
      "startDate": "2023-05-20T09:00:00",
      "dueDate": "2023-06-15T18:00:00",
      "tags": ["urgent", "frontend"],
      "customFields": {
        "complexity": "high",
        "estimatedHours": 40
      },
      "versionCreatedBy": "editor-uuid",
      "versionCreator": {
        "id": "editor-uuid",
        "email": "editor@example.com",
        "name": "Bob Johnson",
        "avatar": "avatar-url"
      },
      "versionCreatedAt": "2023-06-01T11:30:00",
      "changeSummary": "Updated title, priority, due date and added custom fields"
    }
  ],
  "totalElements": 2,
  "totalPages": 1,
  "size": 20,
  "number": 0
}
```

#### 11.1.5 回滚到指定版本

```
POST /api/tasks/{id}/revert/{versionId}
Authorization: Bearer {token}

Response:
Status: 200 OK
Content-Type: application/json

{
  "id": "task-uuid",
  "title": "Original task title",
  "description": "Original description",
  "status": "TODO",
  "priority": "MEDIUM",
  "projectId": "project-uuid",
  "assigneeId": "original-assignee-uuid",
  "createdBy": "creator-uuid",
  "lastEditedBy": "current-user-uuid",
  "startDate": "2023-05-20T09:00:00",
  "dueDate": "2023-06-10T18:00:00",
  "createdAt": "2023-05-20T10:00:00",
  "updatedAt": "2023-06-02T14:20:00",
  "version": 3,
  "tags": ["original-tag"],
  "customFields": {
    "originalField": "value"
  },
  "assignee": {
    "id": "original-assignee-uuid",
    "email": "assignee@example.com",
    "name": "John Doe",
    "avatar": "avatar-url"
  },
  "creator": {
    "id": "creator-uuid",
    "email": "creator@example.com",
    "name": "Jane Smith",
    "avatar": "avatar-url"
  },
  "lastEditor": {
    "id": "current-user-uuid",
    "email": "current@example.com",
    "name": "Current User",
    "avatar": "avatar-url"
  }
}
```

### 11.2 评论管理接口

#### 11.2.1 添加评论

```
POST /api/tasks/{id}/comments
Content-Type: application/json
Authorization: Bearer {token}

Request Body:
{
  "content": "This is a comment on the task",
  "parentCommentId": "parent-comment-uuid"  // 可选，用于回复评论
}

Response:
Status: 201 Created
Content-Type: application/json

{
  "id": "comment-uuid",
  "taskId": "task-uuid",
  "content": "This is a comment on the task",
  "authorId": "author-uuid",
  "author": {
    "id": "author-uuid",
    "email": "author@example.com",
    "name": "John Doe",
    "avatar": "avatar-url"
  },
  "createdAt": "2023-06-02T10:30:00",
  "updatedAt": "2023-06-02T10:30:00",
  "parentCommentId": null,
  "replies": []
}
```

#### 11.2.2 获取任务评论列表

```
GET /api/tasks/{id}/comments
Authorization: Bearer {token}

Response:
Status: 200 OK
Content-Type: application/json

{
  "comments": [
    {
      "id": "comment-uuid-1",
      "taskId": "task-uuid",
      "content": "This is a parent comment",
      "authorId": "author-uuid-1",
      "author": {
        "id": "author-uuid-1",
        "email": "author1@example.com",
        "name": "John Doe",
        "avatar": "avatar-url"
      },
      "createdAt": "2023-06-02T10:30:00",
      "updatedAt": "2023-06-02T10:30:00",
      "parentCommentId": null,
      "replies": [
        {
          "id": "comment-uuid-2",
          "taskId": "task-uuid",
          "content": "This is a reply to the parent comment",
          "authorId": "author-uuid-2",
          "author": {
            "id": "author-uuid-2",
            "email": "author2@example.com",
            "name": "Jane Smith",
            "avatar": "avatar-url"
          },
          "createdAt": "2023-06-02T11:15:00",
          "updatedAt": "2023-06-02T11:15:00",
          "parentCommentId": "comment-uuid-1",
          "replies": []
        }
      ]
    }
  ],
  "totalElements": 2,
  "totalPages": 1,
  "size": 20,
  "number": 0
}
```

### 11.3 附件管理接口

#### 11.3.1 上传附件

```
POST /api/tasks/{id}/attachments
Content-Type: multipart/form-data
Authorization: Bearer {token}

Request Body:
file: [binary file data]
description: "This is a document related to the task"

Response:
Status: 201 Created
Content-Type: application/json

{
  "id": "attachment-uuid",
  "taskId": "task-uuid",
  "fileName": "generated-unique-filename.pdf",
  "originalName": "task-document.pdf",
  "filePath": "/uploads/tasks/task-uuid/generated-unique-filename.pdf",
  "fileSize": 1024000,
  "contentType": "application/pdf",
  "uploadedBy": "user-uuid",
  "uploader": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "avatar-url"
  },
  "uploadedAt": "2023-06-02T14:30:00",
  "description": "This is a document related to the task"
}
```

#### 11.3.2 获取任务附件列表

```
GET /api/tasks/{id}/attachments
Authorization: Bearer {token}

Response:
Status: 200 OK
Content-Type: application/json

{
  "attachments": [
    {
      "id": "attachment-uuid-1",
      "taskId": "task-uuid",
      "fileName": "generated-unique-filename.pdf",
      "originalName": "task-document.pdf",
      "filePath": "/uploads/tasks/task-uuid/generated-unique-filename.pdf",
      "fileSize": 1024000,
      "contentType": "application/pdf",
      "uploadedBy": "user-uuid-1",
      "uploader": {
        "id": "user-uuid-1",
        "email": "user1@example.com",
        "name": "John Doe",
        "avatar": "avatar-url"
      },
      "uploadedAt": "2023-06-02T14:30:00",
      "description": "This is a document related to the task"
    },
    {
      "id": "attachment-uuid-2",
      "taskId": "task-uuid",
      "fileName": "generated-unique-image.png",
      "originalName": "task-screenshot.png",
      "filePath": "/uploads/tasks/task-uuid/generated-unique-image.png",
      "fileSize": 512000,
      "contentType": "image/png",
      "uploadedBy": "user-uuid-2",
      "uploader": {
        "id": "user-uuid-2",
        "email": "user2@example.com",
        "name": "Jane Smith",
        "avatar": "avatar-url"
      },
      "uploadedAt": "2023-06-02T15:45:00",
      "description": "Screenshot showing the issue"
    }
  ],
  "totalElements": 2,
  "totalPages": 1,
  "size": 20,
  "number": 0
}
```

#### 11.3.3 下载附件

```
GET /api/tasks/{taskId}/attachments/{attachmentId}/download
Authorization: Bearer {token}

Response:
Status: 200 OK
Content-Type: {attachment's content type}
Content-Disposition: attachment; filename="{original filename}"
Content-Length: {file size}

[binary file data]
```

#### 11.3.4 删除附件

```
DELETE /api/tasks/{taskId}/attachments/{attachmentId}
Authorization: Bearer {token}

Response:
Status: 200 OK
Content-Type: application/json

{
  "message": "Attachment deleted successfully"
}
```

### 11.4 子任务管理接口

#### 11.4.1 创建子任务

```
POST /api/tasks/{id}/subtasks
Content-Type: application/json
Authorization: Bearer {token}

Request Body:
{
  "title": "Subtask title",
  "description": "Subtask description",
  "status": "TODO",
  "assigneeId": "assignee-uuid",
  "dueDate": "2023-06-15T18:00:00",
  "orderIndex": 1
}

Response:
Status: 201 Created
Content-Type: application/json

{
  "id": "subtask-uuid",
  "parentTaskId": "parent-task-uuid",
  "title": "Subtask title",
  "description": "Subtask description",
  "status": "TODO",
  "assigneeId": "assignee-uuid",
  "assignee": {
    "id": "assignee-uuid",
    "email": "assignee@example.com",
    "name": "John Doe",
    "avatar": "avatar-url"
  },
  "createdBy": "creator-uuid",
  "creator": {
    "id": "creator-uuid",
    "email": "creator@example.com",
    "name": "Jane Smith",
    "avatar": "avatar-url"
  },
  "createdAt": "2023-06-02T10:30:00",
  "updatedAt": "2023-06-02T10:30:00",
  "dueDate": "2023-06-15T18:00:00",
  "orderIndex": 1
}
```

#### 11.4.2 更新子任务

```
PUT /api/tasks/{taskId}/subtasks/{subtaskId}
Content-Type: application/json
Authorization: Bearer {token}

Request Body:
{
  "title": "Updated subtask title",
  "description": "Updated subtask description",
  "status": "IN_PROGRESS",
  "assigneeId": "new-assignee-uuid",
  "dueDate": "2023-06-20T18:00:00",
  "orderIndex": 2
}

Response:
Status: 200 OK
Content-Type: application/json

{
  "id": "subtask-uuid",
  "parentTaskId": "parent-task-uuid",
  "title": "Updated subtask title",
  "description": "Updated subtask description",
  "status": "IN_PROGRESS",
  "assigneeId": "new-assignee-uuid",
  "assignee": {
    "id": "new-assignee-uuid",
    "email": "new-assignee@example.com",
    "name": "New Assignee",
    "avatar": "avatar-url"
  },
  "createdBy": "creator-uuid",
  "creator": {
    "id": "creator-uuid",
    "email": "creator@example.com",
    "name": "Jane Smith",
    "avatar": "avatar-url"
  },
  "createdAt": "2023-06-02T10:30:00",
  "updatedAt": "2023-06-03T14:20:00",
  "dueDate": "2023-06-20T18:00:00",
  "orderIndex": 2
}
```

#### 11.4.3 删除子任务

```
DELETE /api/tasks/{taskId}/subtasks/{subtaskId}
Authorization: Bearer {token}

Response:
Status: 200 OK
Content-Type: application/json

{
  "message": "Subtask deleted successfully"
}
```

#### 11.4.4 获取任务子任务列表

```
GET /api/tasks/{id}/subtasks
Authorization: Bearer {token}

Response:
Status: 200 OK
Content-Type: application/json

{
  "subtasks": [
    {
      "id": "subtask-uuid-1",
      "parentTaskId": "parent-task-uuid",
      "title": "First subtask",
      "description": "Description of first subtask",
      "status": "DONE",
      "assigneeId": "assignee-uuid-1",
      "assignee": {
        "id": "assignee-uuid-1",
        "email": "assignee1@example.com",
        "name": "John Doe",
        "avatar": "avatar-url"
      },
      "createdBy": "creator-uuid",
      "creator": {
        "id": "creator-uuid",
        "email": "creator@example.com",
        "name": "Jane Smith",
        "avatar": "avatar-url"
      },
      "createdAt": "2023-06-02T10:30:00",
      "updatedAt": "2023-06-03T09:15:00",
      "dueDate": "2023-06-10T18:00:00",
      "orderIndex": 1
    },
    {
      "id": "subtask-uuid-2",
      "parentTaskId": "parent-task-uuid",
      "title": "Second subtask",
      "description": "Description of second subtask",
      "status": "IN_PROGRESS",
      "assigneeId": "assignee-uuid-2",
      "assignee": {
        "id": "assignee-uuid-2",
        "email": "assignee2@example.com",
        "name": "Bob Johnson",
        "avatar": "avatar-url"
      },
      "createdBy": "creator-uuid",
      "creator": {
        "id": "creator-uuid",
        "email": "creator@example.com",
        "name": "Jane Smith",
        "avatar": "avatar-url"
      },
      "createdAt": "2023-06-02T11:45:00",
      "updatedAt": "2023-06-03T14:20:00",
      "dueDate": "2023-06-15T18:00:00",
      "orderIndex": 2
    }
  ],
  "totalElements": 2,
  "totalPages": 1,
  "size": 20,
  "number": 0
}
```

### 11.5 时间跟踪接口

#### 11.5.1 开始时间跟踪

```
POST /api/tasks/{id}/time-tracking/start
Content-Type: application/json
Authorization: Bearer {token}

Request Body:
{
  "description": "Working on frontend implementation"
}

Response:
Status: 201 Created
Content-Type: application/json

{
  "id": "time-tracking-uuid",
  "taskId": "task-uuid",
  "userId": "user-uuid",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "avatar-url"
  },
  "startTime": "2023-06-02T09:00:00",
  "endTime": null,
  "durationMinutes": null,
  "description": "Working on frontend implementation",
  "createdAt": "2023-06-02T09:00:00",
  "updatedAt": "2023-06-02T09:00:00"
}
```

#### 11.5.2 停止时间跟踪

```
POST /api/tasks/{taskId}/time-tracking/{timeTrackingId}/stop
Authorization: Bearer {token}

Response:
Status: 200 OK
Content-Type: application/json

{
  "id": "time-tracking-uuid",
  "taskId": "task-uuid",
  "userId": "user-uuid",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "avatar-url"
  },
  "startTime": "2023-06-02T09:00:00",
  "endTime": "2023-06-02T11:30:00",
  "durationMinutes": 150,
  "description": "Working on frontend implementation",
  "createdAt": "2023-06-02T09:00:00",
  "updatedAt": "2023-06-02T11:30:00"
}
```

#### 11.5.3 手动添加时间记录

```
POST /api/tasks/{id}/time-tracking
Content-Type: application/json
Authorization: Bearer {token}

Request Body:
{
  "startTime": "2023-06-01T14:00:00",
  "endTime": "2023-06-01T16:30:00",
  "description": "Code review and testing"
}

Response:
Status: 201 Created
Content-Type: application/json

{
  "id": "time-tracking-uuid",
  "taskId": "task-uuid",
  "userId": "user-uuid",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "avatar-url"
  },
  "startTime": "2023-06-01T14:00:00",
  "endTime": "2023-06-01T16:30:00",
  "durationMinutes": 150,
  "description": "Code review and testing",
  "createdAt": "2023-06-02T09:00:00",
  "updatedAt": "2023-06-02T09:00:00"
}
```

#### 11.5.4 获取任务时间记录

```
GET /api/tasks/{id}/time-tracking
Authorization: Bearer {token}

Response:
Status: 200 OK
Content-Type: application/json

{
  "timeTracking": [
    {
      "id": "time-tracking-uuid-1",
      "taskId": "task-uuid",
      "userId": "user-uuid-1",
      "user": {
        "id": "user-uuid-1",
        "email": "user1@example.com",
        "name": "John Doe",
        "avatar": "avatar-url"
      },
      "startTime": "2023-06-01T14:00:00",
      "endTime": "2023-06-01T16:30:00",
      "durationMinutes": 150,
      "description": "Code review and testing",
      "createdAt": "2023-06-02T09:00:00",
      "updatedAt": "2023-06-02T09:00:00"
    },
    {
      "id": "time-tracking-uuid-2",
      "taskId": "task-uuid",
      "userId": "user-uuid-2",
      "user": {
        "id": "user-uuid-2",
        "email": "user2@example.com",
        "name": "Jane Smith",
        "avatar": "avatar-url"
      },
      "startTime": "2023-06-02T09:00:00",
      "endTime": "2023-06-02T11:30:00",
      "durationMinutes": 150,
      "description": "Working on frontend implementation",
      "createdAt": "2023-06-02T09:00:00",
      "updatedAt": "2023-06-02T11:30:00"
    }
  ],
  "totalElements": 2,
  "totalPages": 1,
  "size": 20,
  "number": 0,
  "totalMinutes": 300
}
```

### 11.6 依赖关系管理接口

#### 11.6.1 创建任务依赖关系

```
POST /api/tasks/{id}/dependencies
Content-Type: application/json
Authorization: Bearer {token}

Request Body:
{
  "targetTaskId": "target-task-uuid",
  "dependencyType": "FINISH_TO_START",
  "description": "Frontend must be completed before backend integration"
}

Response:
Status: 201 Created
Content-Type: application/json

{
  "id": "dependency-uuid",
  "sourceTaskId": "source-task-uuid",
  "targetTaskId": "target-task-uuid",
  "dependencyType": "FINISH_TO_START",
  "createdBy": "user-uuid",
  "creator": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "avatar-url"
  },
  "createdAt": "2023-06-02T10:30:00",
  "description": "Frontend must be completed before backend integration"
}
```

#### 11.6.2 删除任务依赖关系

```
DELETE /api/tasks/{taskId}/dependencies/{dependencyId}
Authorization: Bearer {token}

Response:
Status: 200 OK
Content-Type: application/json

{
  "message": "Task dependency deleted successfully"
}
```

#### 11.6.3 获取任务依赖关系

```
GET /api/tasks/{id}/dependencies
Authorization: Bearer {token}

Response:
Status: 200 OK
Content-Type: application/json

{
  "dependencies": [
    {
      "id": "dependency-uuid-1",
      "sourceTaskId": "current-task-uuid",
      "targetTaskId": "dependent-task-uuid",
      "dependencyType": "FINISH_TO_START",
      "createdBy": "user-uuid-1",
      "creator": {
        "id": "user-uuid-1",
        "email": "user1@example.com",
        "name": "John Doe",
        "avatar": "avatar-url"
      },
      "createdAt": "2023-06-02T10:30:00",
      "description": "This task must be completed before dependent task"
    },
    {
      "id": "dependency-uuid-2",
      "sourceTaskId": "prerequisite-task-uuid",
      "targetTaskId": "current-task-uuid",
      "dependencyType": "FINISH_TO_START",
      "createdBy": "user-uuid-2",
      "creator": {
        "id": "user-uuid-2",
        "email": "user2@example.com",
        "name": "Jane Smith",
        "avatar": "avatar-url"
      },
      "createdAt": "2023-06-01T15:45:00",
      "description": "Prerequisite task must be completed before this task"
    }
  ],
  "totalElements": 2,
  "totalPages": 1,
  "size": 20,
  "number": 0
}
```

### 11.7 自定义字段管理接口

#### 11.7.1 创建项目自定义字段

```
POST /api/projects/{projectId}/custom-fields
Content-Type: application/json
Authorization: Bearer {token}

Request Body:
{
  "fieldName": "complexity",
  "fieldLabel": "Complexity Level",
  "fieldType": "SELECT",
  "isRequired": true,
  "defaultValue": "medium",
  "options": ["low", "medium", "high", "critical"]
}

Response:
Status: 201 Created
Content-Type: application/json

{
  "id": "custom-field-uuid",
  "projectId": "project-uuid",
  "fieldName": "complexity",
  "fieldLabel": "Complexity Level",
  "fieldType": "SELECT",
  "isRequired": true,
  "defaultValue": "medium",
  "options": ["low", "medium", "high", "critical"],
  "createdBy": "user-uuid",
  "creator": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "avatar-url"
  },
  "createdAt": "2023-06-02T10:30:00",
  "updatedAt": "2023-06-02T10:30:00"
}
```

#### 11.7.2 获取项目自定义字段列表

```
GET /api/projects/{projectId}/custom-fields
Authorization: Bearer {token}

Response:
Status: 200 OK
Content-Type: application/json

{
  "customFields": [
    {
      "id": "custom-field-uuid-1",
      "projectId": "project-uuid",
      "fieldName": "complexity",
      "fieldLabel": "Complexity Level",
      "fieldType": "SELECT",
      "isRequired": true,
      "defaultValue": "medium",
      "options": ["low", "medium", "high", "critical"],
      "createdBy": "user-uuid-1",
      "creator": {
        "id": "user-uuid-1",
        "email": "user1@example.com",
        "name": "John Doe",
        "avatar": "avatar-url"
      },
      "createdAt": "2023-06-02T10:30:00",
      "updatedAt": "2023-06-02T10:30:00"
    },
    {
      "id": "custom-field-uuid-2",
      "projectId": "project-uuid",
      "fieldName": "estimatedHours",
      "fieldLabel": "Estimated Hours",
      "fieldType": "NUMBER",
      "isRequired": false,
      "defaultValue": null,
      "options": null,
      "createdBy": "user-uuid-2",
      "creator": {
        "id": "user-uuid-2",
        "email": "user2@example.com",
        "name": "Jane Smith",
        "avatar": "avatar-url"
      },
      "createdAt": "2023-06-01T15:45:00",
      "updatedAt": "2023-06-01T15:45:00"
    }
  ],
  "totalElements": 2,
  "totalPages": 1,
  "size": 20,
  "number": 0
}
```

#### 11.7.3 更新任务自定义字段值

```
PUT /api/tasks/{id}/custom-fields
Content-Type: application/json
Authorization: Bearer {token}

Request Body:
{
  "customFields": {
    "complexity": "high",
    "estimatedHours": 40,
    "needsReview": true
  }
}

Response:
Status: 200 OK
Content-Type: application/json

{
  "id": "task-uuid",
  "title": "Task title",
  "description": "Task description",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "projectId": "project-uuid",
  "assigneeId": "assignee-uuid",
  "createdBy": "creator-uuid",
  "lastEditedBy": "editor-uuid",
  "startDate": "2023-06-01T09:00:00",
  "dueDate": "2023-06-15T18:00:00",
  "createdAt": "2023-05-20T10:00:00",
  "updatedAt": "2023-06-02T14:20:00",
  "version": 3,
  "tags": ["urgent", "frontend"],
  "customFields": {
    "complexity": "high",
    "estimatedHours": 40,
    "needsReview": true
  },
  "assignee": {
    "id": "assignee-uuid",
    "email": "assignee@example.com",
    "name": "John Doe",
    "avatar": "avatar-url"
  },
  "creator": {
    "id": "creator-uuid",
    "email": "creator@example.com",
    "name": "Jane Smith",
    "avatar": "avatar-url"
  },
  "lastEditor": {
    "id": "editor-uuid",
    "email": "editor@example.com",
    "name": "Bob Johnson",
    "avatar": "avatar-url"
  }
}
```

## 12. 验证规则和错误处理

### 12.1 请求验证规则

#### 12.1.1 任务验证规则

```java
public class TaskValidation {
    // 标题验证
    @NotBlank(message = "Task title is required")
    @Size(min = 1, max = 255, message = "Task title must be between 1 and 255 characters")
    private String title;
    
    // 描述验证
    @Size(max = 5000, message = "Task description must not exceed 5000 characters")
    private String description;
    
    // 状态验证
    @NotNull(message = "Task status is required")
    private TaskStatus status;
    
    // 优先级验证
    @NotNull(message = "Task priority is required")
    private Priority priority;
    
    // 项目ID验证
    @NotNull(message = "Project ID is required")
    private UUID projectId;
    
    // 开始日期和截止日期验证
    @ValidDateRange(message = "Start date must be before due date")
    private DateRange dateRange;
    
    // 标签验证
    @Size(max = 10, message = "Maximum 10 tags allowed")
    private List<@NotBlank(message = "Tag cannot be blank") @Size(max = 50, message = "Tag must not exceed 50 characters") String> tags;
    
    // 自定义字段验证
    @ValidCustomFields(message = "Custom fields validation failed")
    private Map<String, Object> customFields;
}
```

#### 12.1.2 评论验证规则

```java
public class CommentValidation {
    // 内容验证
    @NotBlank(message = "Comment content is required")
    @Size(min = 1, max = 2000, message = "Comment content must be between 1 and 2000 characters")
    private String content;
    
    // 父评论ID验证
    @ValidParentComment(message = "Invalid parent comment")
    private UUID parentCommentId;
}
```

#### 12.1.3 附件验证规则

```java
public class AttachmentValidation {
    // 文件验证
    @NotNull(message = "File is required")
    @ValidFile(message = "Invalid file")
    private MultipartFile file;
    
    // 描述验证
    @Size(max = 500, message = "Attachment description must not exceed 500 characters")
    private String description;
}
```

### 12.2 错误响应格式

```java
public class ErrorResponse {
    private String timestamp;
    private Integer status;
    private String error;
    private String message;
    private List<FieldError> fieldErrors;
    private String path;
    
    // 构造函数、getter和setter方法
    // (省略)
}

public class FieldError {
    private String field;
    private String rejectedValue;
    private String message;
    
    // 构造函数、getter和setter方法
    // (省略)
}
```

### 12.3 常见错误码和消息

| 错误码 | HTTP状态码 | 消息 | 描述 |
|--------|------------|------|------|
| TASK_NOT_FOUND | 404 | Task not found or access denied | 任务不存在或无权访问 |
| PROJECT_NOT_FOUND | 404 | Project not found or access denied | 项目不存在或无权访问 |
| INVALID_TASK_STATUS | 400 | Invalid task status transition | 无效的任务状态转换 |
| INVALID_DATE_RANGE | 400 | Start date must be before due date | 开始日期必须早于截止日期 |
| FILE_TOO_LARGE | 400 | File size exceeds maximum allowed size | 文件大小超过限制 |
| UNSUPPORTED_FILE_TYPE | 400 | Unsupported file type | 不支持的文件类型 |
| DEPENDENCY_CYCLE | 400 | Creating this dependency would result in a cycle | 创建此依赖关系会导致循环依赖 |
| CUSTOM_FIELD_VALIDATION_FAILED | 400 | Custom field validation failed | 自定义字段验证失败 |
| BULK_UPDATE_LIMIT_EXCEEDED | 400 | Bulk update limit exceeded | 批量更新数量超过限制 |
| COMMENT_NOT_FOUND | 404 | Comment not found or access denied | 评论不存在或无权访问 |
| ATTACHMENT_NOT_FOUND | 404 | Attachment not found or access denied | 附件不存在或无权访问 |
| TIME_TRACKING_ALREADY_ACTIVE | 409 | Time tracking is already active for this task | 该任务的时间跟踪已在进行中 |
| TIME_TRACKING_NOT_ACTIVE | 409 | No active time tracking found for this task | 该任务没有进行中的时间跟踪 |
| INSUFFICIENT_PERMISSIONS | 403 | Insufficient permissions to perform this action | 权限不足，无法执行此操作 |

### 12.4 全局异常处理

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        List<FieldError> fieldErrors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> new FieldError(
                        error.getField(),
                        error.getRejectedValue(),
                        error.getDefaultMessage()))
                .collect(Collectors.toList());
        
        ErrorResponse errorResponse = new ErrorResponse(
                LocalDateTime.now().toString(),
                HttpStatus.BAD_REQUEST.value(),
                "Validation Failed",
                "Request validation failed",
                fieldErrors,
                getRequestPath());
        
        return ResponseEntity.badRequest().body(errorResponse);
    }
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(
            ResourceNotFoundException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                LocalDateTime.now().toString(),
                HttpStatus.NOT_FOUND.value(),
                "Resource Not Found",
                ex.getMessage(),
                null,
                getRequestPath());
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }
    
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(
            AccessDeniedException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                LocalDateTime.now().toString(),
                HttpStatus.FORBIDDEN.value(),
                "Access Denied",
                "You don't have permission to perform this action",
                null,
                getRequestPath());
        
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
    }
    
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(
            BusinessException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                LocalDateTime.now().toString(),
                ex.getStatus().value(),
                ex.getErrorCode(),
                ex.getMessage(),
                null,
                getRequestPath());
        
        return ResponseEntity.status(ex.getStatus()).body(errorResponse);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(
            Exception ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                LocalDateTime.now().toString(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal Server Error",
                "An unexpected error occurred",
                null,
                getRequestPath());
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
    
    private String getRequestPath() {
        HttpServletRequest request = ((ServletRequestAttributes) 
                RequestContextHolder.currentRequestAttributes()).getRequest();
        return request.getRequestURI();
    }
}
```

## 13. 数据库索引优化建议

```sql
-- 任务表索引
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX idx_tasks_created_by ON tasks(created_by);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_updated_at ON tasks(updated_at);

-- 任务历史表索引
CREATE INDEX idx_task_history_task_id ON task_history(task_id);
CREATE INDEX idx_task_history_changed_by ON task_history(changed_by);
CREATE INDEX idx_task_history_changed_at ON task_history(changed_at);
CREATE INDEX idx_task_history_field_name ON task_history(field_name);

-- 任务版本表索引
CREATE INDEX idx_task_versions_task_id ON task_versions(task_id);
CREATE INDEX idx_task_versions_version_number ON task_versions(task_id, version_number);
CREATE INDEX idx_task_versions_created_at ON task_versions(version_created_at);

-- 评论表索引
CREATE INDEX idx_task_comments_task_id ON task_comments(task_id);
CREATE INDEX idx_task_comments_author_id ON task_comments(author_id);
CREATE INDEX idx_task_comments_parent_id ON task_comments(parent_comment_id);
CREATE INDEX idx_task_comments_created_at ON task_comments(created_at);

-- 附件表索引
CREATE INDEX idx_task_attachments_task_id ON task_attachments(task_id);
CREATE INDEX idx_task_attachments_uploaded_by ON task_attachments(uploaded_by);
CREATE INDEX idx_task_attachments_uploaded_at ON task_attachments(uploaded_at);

-- 子任务表索引
CREATE INDEX idx_subtasks_parent_task_id ON subtasks(parent_task_id);
CREATE INDEX idx_subtasks_assignee_id ON subtasks(assignee_id);
CREATE INDEX idx_subtasks_created_by ON subtasks(created_by);
CREATE INDEX idx_subtasks_status ON subtasks(status);

-- 时间跟踪表索引
CREATE INDEX idx_time_tracking_task_id ON time_tracking(task_id);
CREATE INDEX idx_time_tracking_user_id ON time_tracking(user_id);
CREATE INDEX idx_time_tracking_start_time ON time_tracking(start_time);
CREATE INDEX idx_time_tracking_end_time ON time_tracking(end_time);

-- 任务依赖表索引
CREATE INDEX idx_task_dependencies_source_task_id ON task_dependencies(source_task_id);
CREATE INDEX idx_task_dependencies_target_task_id ON task_dependencies(target_task_id);
CREATE INDEX idx_task_dependencies_created_by ON task_dependencies(created_by);

-- 自定义字段表索引
CREATE INDEX idx_custom_fields_project_id ON custom_fields(project_id);
CREATE INDEX idx_custom_fields_field_name ON custom_fields(field_name);

-- 任务自定义字段值表索引
CREATE INDEX idx_task_custom_field_values_task_id ON task_custom_field_values(task_id);
CREATE INDEX idx_task_custom_field_values_field_id ON task_custom_field_values(custom_field_id);
```

## 14. API使用示例

### 14.1 创建任务并添加标签和自定义字段

```bash
# 1. 创建任务
curl -X POST "http://localhost:8080/api/tasks/projects/project-uuid" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer jwt-token" \
  -d '{
    "title": "Implement user authentication",
    "description": "Add JWT-based authentication to the application",
    "priority": "HIGH",
    "assigneeId": "assignee-uuid",
    "startDate": "2023-06-01T09:00:00",
    "dueDate": "2023-06-15T18:00:00"
  }'

# 2. 更新任务，添加标签和自定义字段
curl -X PATCH "http://localhost:8080/api/tasks/task-uuid" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer jwt-token" \
  -d '{
    "tags": ["authentication", "security", "backend"],
    "customFields": {
      "complexity": "high",
      "estimatedHours": 40,
      "needsReview": true
    }
  }'
```

### 14.2 添加评论和附件

```bash
# 1. 添加评论
curl -X POST "http://localhost:8080/api/tasks/task-uuid/comments" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer jwt-token" \
  -d '{
    "content": "I have completed the initial implementation of JWT authentication. Please review the code."
  }'

# 2. 上传附件
curl -X POST "http://localhost:8080/api/tasks/task-uuid/attachments" \
  -H "Authorization: Bearer jwt-token" \
  -F "file=@/path/to/authentication-design.pdf" \
  -F "description=Authentication design document"
```

### 14.3 时间跟踪

```bash
# 1. 开始时间跟踪
curl -X POST "http://localhost:8080/api/tasks/task-uuid/time-tracking/start" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer jwt-token" \
  -d '{
    "description": "Working on JWT token validation"
  }'

# 2. 停止时间跟踪
curl -X POST "http://localhost:8080/api/tasks/task-uuid/time-tracking/time-tracking-uuid/stop" \
  -H "Authorization: Bearer jwt-token"
```

### 14.4 批量更新任务

```bash
curl -X POST "http://localhost:8080/api/tasks/bulk-update" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer jwt-token" \
  -d '{
    "taskIds": ["task-uuid-1", "task-uuid-2", "task-uuid-3"],
    "updates": {
      "status": "DONE",
      "tags": ["completed", "q3-2023"]
    }
  }'
```

### 14.5 查看任务历史和版本

```bash
# 1. 查看任务历史
curl -X GET "http://localhost:8080/api/tasks/task-uuid/history" \
  -H "Authorization: Bearer jwt-token"

# 2. 查看任务版本
curl -X GET "http://localhost:8080/api/tasks/task-uuid/versions" \
  -H "Authorization: Bearer jwt-token"

# 3. 回滚到指定版本
curl -X POST "http://localhost:8080/api/tasks/task-uuid/revert/version-uuid" \
  -H "Authorization: Bearer jwt-token"
```

## 15. 总结

本设计文档详细扩展了任务管理系统的后端API接口和数据模型，包括：

1. **扩展的Task模型**：添加了标签、版本号、最后编辑人、编辑历史、子任务、附件、评论、时间跟踪、依赖关系和自定义字段等新功能。

2. **新增模型**：设计了TaskHistory、TaskVersion、TaskComment、TaskAttachment、SubTask、TimeTracking、TaskDependency、CustomField等模型，支持更丰富的任务管理功能。

3. **DTO设计**：为所有新模型设计了对应的DTO类，确保API接口的数据传输格式清晰明确。

4. **API接口**：设计了详细的RESTful API接口，包括部分更新、批量更新、历史记录、版本控制、评论管理、附件管理、子任务管理、时间跟踪、依赖关系管理和自定义字段管理等。

5. **验证规则和错误处理**：定义了完整的请求验证规则和错误处理机制，确保API的健壮性和安全性。

6. **数据库优化**：提供了数据库索引优化建议，提高查询性能。

这个设计为任务管理系统提供了全面的功能扩展，支持更复杂的任务管理场景，如版本控制、历史记录、协作评论、文件共享、时间跟踪等，同时保持了良好的可扩展性和可维护性。
