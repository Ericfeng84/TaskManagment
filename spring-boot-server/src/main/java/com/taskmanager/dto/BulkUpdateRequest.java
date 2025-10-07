package com.taskmanager.dto;

import java.util.List;
import java.util.UUID;

public class BulkUpdateRequest {
    private List<UUID> taskIds;
    private TaskPatchDTO updates;

    public BulkUpdateRequest() {
    }

    public BulkUpdateRequest(List<UUID> taskIds, TaskPatchDTO updates) {
        this.taskIds = taskIds;
        this.updates = updates;
    }

    // Getters and Setters
    public List<UUID> getTaskIds() {
        return taskIds;
    }

    public void setTaskIds(List<UUID> taskIds) {
        this.taskIds = taskIds;
    }

    public TaskPatchDTO getUpdates() {
        return updates;
    }

    public void setUpdates(TaskPatchDTO updates) {
        this.updates = updates;
    }
}