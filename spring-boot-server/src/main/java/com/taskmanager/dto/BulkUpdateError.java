package com.taskmanager.dto;

import java.util.UUID;

public class BulkUpdateError {
    private UUID taskId;
    private String errorMessage;
    private String errorCode;

    public BulkUpdateError() {
    }

    public BulkUpdateError(UUID taskId, String errorMessage, String errorCode) {
        this.taskId = taskId;
        this.errorMessage = errorMessage;
        this.errorCode = errorCode;
    }

    // Getters and Setters
    public UUID getTaskId() {
        return taskId;
    }

    public void setTaskId(UUID taskId) {
        this.taskId = taskId;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }
}