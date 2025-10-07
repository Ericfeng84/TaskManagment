package com.taskmanager.controller;

import com.taskmanager.dto.*;
import com.taskmanager.model.Priority;
import com.taskmanager.model.TaskStatus;
import com.taskmanager.model.TaskHistory;
import com.taskmanager.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TaskController {

    @Autowired
    private TaskService taskService;

    private UUID getCurrentUserId(Authentication authentication) {
        return UUID.fromString(authentication.getName());
    }

    @GetMapping("/projects/{projectId}")
    public ResponseEntity<List<TaskDTO>> getProjectTasks(@PathVariable UUID projectId, Authentication authentication) {
        try {
            UUID userId = getCurrentUserId(authentication);
            List<TaskDTO> tasks = taskService.getProjectTasks(projectId, userId);
            return ResponseEntity.ok(tasks);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/projects/{projectId}")
    public ResponseEntity<TaskDTO> createTask(@PathVariable UUID projectId, @RequestBody Map<String, Object> request, Authentication authentication) {
        try {
            UUID userId = getCurrentUserId(authentication);
            
            String title = (String) request.get("title");
            String description = (String) request.get("description");
            Priority priority = request.get("priority") != null ?
                Priority.valueOf((String) request.get("priority")) : Priority.MEDIUM;
            UUID assigneeId = request.get("assigneeId") != null ?
                UUID.fromString((String) request.get("assigneeId")) : null;
            LocalDateTime startDate = request.get("startDate") != null ?
                parseDateTime((String) request.get("startDate")) : null;
            LocalDateTime dueDate = request.get("dueDate") != null ?
                parseDateTime((String) request.get("dueDate")) : null;

            TaskDTO task = taskService.createTask(projectId, title, description, priority, assigneeId, userId, startDate, dueDate, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(task);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO> updateTask(@PathVariable UUID id, @RequestBody Map<String, Object> request, Authentication authentication) {
        try {
            UUID userId = getCurrentUserId(authentication);
            
            String title = (String) request.get("title");
            String description = (String) request.get("description");
            TaskStatus status = request.get("status") != null ? 
                TaskStatus.valueOf((String) request.get("status")) : null;
            Priority priority = request.get("priority") != null ? 
                Priority.valueOf((String) request.get("priority")) : null;
            UUID assigneeId = request.get("assigneeId") != null ?
                UUID.fromString((String) request.get("assigneeId")) : null;
            LocalDateTime startDate = request.get("startDate") != null ?
                parseDateTime((String) request.get("startDate")) : null;
            LocalDateTime dueDate = request.get("dueDate") != null ?
                parseDateTime((String) request.get("dueDate")) : null;

            TaskDTO task = taskService.updateTask(id, title, description, status, priority, assigneeId, startDate, dueDate, userId);
            return ResponseEntity.ok(task);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTask(@PathVariable UUID id, Authentication authentication) {
        try {
            UUID userId = getCurrentUserId(authentication);
            taskService.deleteTask(id, userId);
            return ResponseEntity.ok(Map.of("message", "Task deleted successfully."));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<TaskDTO> patchTask(@PathVariable UUID id, @RequestBody TaskPatchDTO patchDTO, Authentication authentication) {
        try {
            UUID userId = getCurrentUserId(authentication);
            TaskDTO task = taskService.patchTask(id, patchDTO, userId);
            return ResponseEntity.ok(task);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/bulk-update")
    public ResponseEntity<BulkUpdateResponse> bulkUpdateTasks(@RequestBody BulkUpdateRequest request, Authentication authentication) {
        try {
            UUID userId = getCurrentUserId(authentication);
            BulkUpdateResponse response = taskService.bulkUpdateTasks(request, userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<TaskHistoryDTO>> getTaskHistory(@PathVariable UUID id, Authentication authentication) {
        try {
            UUID userId = getCurrentUserId(authentication);
            List<TaskHistory> history = taskService.getTaskHistory(id, userId);
            List<TaskHistoryDTO> historyDTOs = history.stream().map(this::convertToHistoryDTO).collect(Collectors.toList());
            return ResponseEntity.ok(historyDTOs);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    private TaskHistoryDTO convertToHistoryDTO(TaskHistory history) {
        TaskHistoryDTO dto = new TaskHistoryDTO();
        dto.setId(history.getId());
        dto.setTaskId(history.getTaskId());
        dto.setFieldName(history.getFieldName());
        dto.setOldValue(history.getOldValue());
        dto.setNewValue(history.getNewValue());
        dto.setChangedBy(history.getChangedBy());
        dto.setChangeType(history.getChangeType());
        dto.setChangedAt(history.getChangedAt());
        dto.setDescription(history.getDescription());
        
        // Set user info
        if (history.getChangedByUser() != null) {
            UserDTO userDTO = new UserDTO(
                history.getChangedByUser().getId(),
                history.getChangedByUser().getEmail(),
                history.getChangedByUser().getName(),
                history.getChangedByUser().getAvatar()
            );
            dto.setChangedByUser(userDTO);
        }
        
        return dto;
    }
    
    private LocalDateTime parseDateTime(String dateTimeStr) {
        if (dateTimeStr == null || dateTimeStr.isEmpty()) {
            return null;
        }
        
        try {
            // Try parsing as ISO format with timezone first
            if (dateTimeStr.endsWith("Z")) {
                return java.time.ZonedDateTime.parse(dateTimeStr).toLocalDateTime();
            }
            // Try parsing as LocalDateTime
            return LocalDateTime.parse(dateTimeStr);
        } catch (Exception e) {
            return null;
        }
    }
}