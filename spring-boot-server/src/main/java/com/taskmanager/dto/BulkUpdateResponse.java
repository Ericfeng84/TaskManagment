package com.taskmanager.dto;

import java.util.List;
import java.util.UUID;

public class BulkUpdateResponse {
    private List<UUID> successfulUpdates;
    private List<BulkUpdateError> failedUpdates;
    private Integer totalRequested;
    private Integer totalSuccessful;
    private Integer totalFailed;

    public BulkUpdateResponse() {
    }

    public BulkUpdateResponse(List<UUID> successfulUpdates, List<BulkUpdateError> failedUpdates,
                             Integer totalRequested, Integer totalSuccessful, Integer totalFailed) {
        this.successfulUpdates = successfulUpdates;
        this.failedUpdates = failedUpdates;
        this.totalRequested = totalRequested;
        this.totalSuccessful = totalSuccessful;
        this.totalFailed = totalFailed;
    }

    // Getters and Setters
    public List<UUID> getSuccessfulUpdates() {
        return successfulUpdates;
    }

    public void setSuccessfulUpdates(List<UUID> successfulUpdates) {
        this.successfulUpdates = successfulUpdates;
    }

    public List<BulkUpdateError> getFailedUpdates() {
        return failedUpdates;
    }

    public void setFailedUpdates(List<BulkUpdateError> failedUpdates) {
        this.failedUpdates = failedUpdates;
    }

    public Integer getTotalRequested() {
        return totalRequested;
    }

    public void setTotalRequested(Integer totalRequested) {
        this.totalRequested = totalRequested;
    }

    public Integer getTotalSuccessful() {
        return totalSuccessful;
    }

    public void setTotalSuccessful(Integer totalSuccessful) {
        this.totalSuccessful = totalSuccessful;
    }

    public Integer getTotalFailed() {
        return totalFailed;
    }

    public void setTotalFailed(Integer totalFailed) {
        this.totalFailed = totalFailed;
    }
}