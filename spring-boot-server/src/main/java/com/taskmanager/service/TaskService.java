package com.taskmanager.service;

import com.taskmanager.dto.*;
import com.taskmanager.model.*;
import com.taskmanager.repository.ProjectRepository;
import com.taskmanager.repository.TaskHistoryRepository;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskHistoryRepository taskHistoryRepository;

    public List<TaskDTO> getProjectTasks(UUID projectId, UUID userId) {
        // Check if user has access to the project
        if (!projectRepository.findUserProjectById(projectId, userId).isPresent()) {
            throw new RuntimeException("Project not found or access denied.");
        }

        List<Task> tasks = taskRepository.findProjectTasksByUser(projectId, userId);

        return tasks.stream().map(task -> {
            TaskDTO taskDTO = new TaskDTO();
            taskDTO.setId(task.getId());
            taskDTO.setTitle(task.getTitle());
            taskDTO.setDescription(task.getDescription());
            taskDTO.setStatus(task.getStatus());
            taskDTO.setPriority(task.getPriority());
            taskDTO.setProjectId(task.getProjectId());
            taskDTO.setAssigneeId(task.getAssigneeId());
            taskDTO.setCreatedBy(task.getCreatedBy());
            taskDTO.setStartDate(task.getStartDate());
            taskDTO.setDueDate(task.getDueDate());
            taskDTO.setCreatedAt(task.getCreatedAt());
            taskDTO.setUpdatedAt(task.getUpdatedAt());
            
            // Set new fields
            taskDTO.setVersion(task.getVersion());
            taskDTO.setLastEditedBy(task.getLastEditedBy());
            taskDTO.setTags(task.getTagsList());
            taskDTO.setCustomFields(task.getCustomFieldsMap());

            // Set assignee
            if (task.getAssigneeId() != null) {
                User assignee = userRepository.findById(task.getAssigneeId()).orElse(null);
                if (assignee != null) {
                    UserDTO assigneeDTO = new UserDTO(
                            assignee.getId(),
                            assignee.getEmail(),
                            assignee.getName(),
                            assignee.getAvatar()
                    );
                    taskDTO.setAssignee(assigneeDTO);
                }
            }

            // Set creator
            User creator = userRepository.findById(task.getCreatedBy()).orElse(null);
            if (creator != null) {
                UserDTO creatorDTO = new UserDTO(
                        creator.getId(),
                        creator.getEmail(),
                        creator.getName(),
                        creator.getAvatar()
                );
                taskDTO.setCreator(creatorDTO);
            }

            // Set last editor
            if (task.getLastEditedBy() != null) {
                User lastEditor = userRepository.findById(task.getLastEditedBy()).orElse(null);
                if (lastEditor != null) {
                    UserDTO lastEditorDTO = new UserDTO(
                            lastEditor.getId(),
                            lastEditor.getEmail(),
                            lastEditor.getName(),
                            lastEditor.getAvatar()
                    );
                    taskDTO.setLastEditor(lastEditorDTO);
                }
            }

            return taskDTO;
        }).collect(Collectors.toList());
    }

    public TaskDTO createTask(UUID projectId, String title, String description, Priority priority,
                             UUID assigneeId, UUID createdBy, java.time.LocalDateTime startDate, java.time.LocalDateTime dueDate, UUID userId) {
        // Check if user has access to the project
        if (!projectRepository.findUserProjectById(projectId, userId).isPresent()) {
            throw new RuntimeException("Project not found or access denied.");
        }

        Task task = new Task();
        task.setTitle(title);
        task.setDescription(description);
        task.setStatus(TaskStatus.TODO);
        task.setPriority(priority != null ? priority : Priority.MEDIUM);
        task.setProjectId(projectId);
        task.setAssigneeId(assigneeId);
        task.setCreatedBy(createdBy);
        task.setStartDate(startDate);
        task.setDueDate(dueDate);

        Task savedTask = taskRepository.save(task);

        TaskDTO taskDTO = new TaskDTO();
        taskDTO.setId(savedTask.getId());
        taskDTO.setTitle(savedTask.getTitle());
        taskDTO.setDescription(savedTask.getDescription());
        taskDTO.setStatus(savedTask.getStatus());
        taskDTO.setPriority(savedTask.getPriority());
        taskDTO.setProjectId(savedTask.getProjectId());
        taskDTO.setAssigneeId(savedTask.getAssigneeId());
        taskDTO.setCreatedBy(savedTask.getCreatedBy());
        taskDTO.setStartDate(savedTask.getStartDate());
        taskDTO.setDueDate(savedTask.getDueDate());
        taskDTO.setCreatedAt(savedTask.getCreatedAt());
        taskDTO.setUpdatedAt(savedTask.getUpdatedAt());
        
        // Set new fields
        taskDTO.setVersion(savedTask.getVersion());
        taskDTO.setLastEditedBy(savedTask.getLastEditedBy());
        taskDTO.setTags(savedTask.getTagsList());
        taskDTO.setCustomFields(savedTask.getCustomFieldsMap());

        // Set assignee
        if (savedTask.getAssigneeId() != null) {
            User assignee = userRepository.findById(savedTask.getAssigneeId()).orElse(null);
            if (assignee != null) {
                UserDTO assigneeDTO = new UserDTO(
                        assignee.getId(),
                        assignee.getEmail(),
                        assignee.getName(),
                        assignee.getAvatar()
                );
                taskDTO.setAssignee(assigneeDTO);
            }
        }

        // Set creator
        User creator = userRepository.findById(savedTask.getCreatedBy()).orElse(null);
        if (creator != null) {
            UserDTO creatorDTO = new UserDTO(
                    creator.getId(),
                    creator.getEmail(),
                    creator.getName(),
                    creator.getAvatar()
            );
            taskDTO.setCreator(creatorDTO);
        }

        return taskDTO;
    }

    public TaskDTO updateTask(UUID taskId, String title, String description, TaskStatus status,
                             Priority priority, UUID assigneeId, java.time.LocalDateTime startDate, java.time.LocalDateTime dueDate, UUID userId) {
        Task task = taskRepository.findUserTaskById(taskId, userId)
                .orElseThrow(() -> new RuntimeException("Task not found or access denied."));

        task.setTitle(title);
        task.setDescription(description);
        task.setStatus(status);
        task.setPriority(priority);
        task.setAssigneeId(assigneeId);
        task.setStartDate(startDate);
        task.setDueDate(dueDate);

        Task updatedTask = taskRepository.save(task);

        TaskDTO taskDTO = new TaskDTO();
        taskDTO.setId(updatedTask.getId());
        taskDTO.setTitle(updatedTask.getTitle());
        taskDTO.setDescription(updatedTask.getDescription());
        taskDTO.setStatus(updatedTask.getStatus());
        taskDTO.setPriority(updatedTask.getPriority());
        taskDTO.setProjectId(updatedTask.getProjectId());
        taskDTO.setAssigneeId(updatedTask.getAssigneeId());
        taskDTO.setCreatedBy(updatedTask.getCreatedBy());
        taskDTO.setStartDate(updatedTask.getStartDate());
        taskDTO.setDueDate(updatedTask.getDueDate());
        taskDTO.setCreatedAt(updatedTask.getCreatedAt());
        taskDTO.setUpdatedAt(updatedTask.getUpdatedAt());
        
        // Set new fields
        taskDTO.setVersion(updatedTask.getVersion());
        taskDTO.setLastEditedBy(updatedTask.getLastEditedBy());
        taskDTO.setTags(updatedTask.getTagsList());
        taskDTO.setCustomFields(updatedTask.getCustomFieldsMap());

        // Set assignee
        if (updatedTask.getAssigneeId() != null) {
            User assignee = userRepository.findById(updatedTask.getAssigneeId()).orElse(null);
            if (assignee != null) {
                UserDTO assigneeDTO = new UserDTO(
                        assignee.getId(),
                        assignee.getEmail(),
                        assignee.getName(),
                        assignee.getAvatar()
                );
                taskDTO.setAssignee(assigneeDTO);
            }
        }

        // Set creator
        User creator = userRepository.findById(updatedTask.getCreatedBy()).orElse(null);
        if (creator != null) {
            UserDTO creatorDTO = new UserDTO(
                    creator.getId(),
                    creator.getEmail(),
                    creator.getName(),
                    creator.getAvatar()
            );
            taskDTO.setCreator(creatorDTO);
        }

        return taskDTO;
    }

    public void deleteTask(UUID taskId, UUID userId) {
        Task task = taskRepository.findUserTaskById(taskId, userId)
                .orElseThrow(() -> new RuntimeException("Task not found or access denied."));

        taskRepository.delete(task);
    }

    @Transactional
    public TaskDTO patchTask(UUID taskId, TaskPatchDTO patchDTO, UUID userId) {
        Task task = taskRepository.findUserTaskById(taskId, userId)
                .orElseThrow(() -> new RuntimeException("Task not found or access denied."));

        // Store original values for history tracking
        String originalTitle = task.getTitle();
        String originalDescription = task.getDescription();
        TaskStatus originalStatus = task.getStatus();
        Priority originalPriority = task.getPriority();
        UUID originalAssigneeId = task.getAssigneeId();
        LocalDateTime originalStartDate = task.getStartDate();
        LocalDateTime originalDueDate = task.getDueDate();
        List<String> originalTags = task.getTagsList();
        Map<String, Object> originalCustomFields = task.getCustomFieldsMap();

        // Apply patches
        if (patchDTO.getTitle() != null) {
            task.setTitle(patchDTO.getTitle());
        }
        if (patchDTO.getDescription() != null) {
            task.setDescription(patchDTO.getDescription());
        }
        if (patchDTO.getStatus() != null) {
            task.setStatus(patchDTO.getStatus());
        }
        if (patchDTO.getPriority() != null) {
            task.setPriority(patchDTO.getPriority());
        }
        if (patchDTO.getAssigneeId() != null) {
            task.setAssigneeId(patchDTO.getAssigneeId());
        }
        if (patchDTO.getStartDate() != null) {
            task.setStartDate(patchDTO.getStartDate());
        }
        if (patchDTO.getDueDate() != null) {
            task.setDueDate(patchDTO.getDueDate());
        }
        if (patchDTO.getTags() != null) {
            task.setTagsList(patchDTO.getTags());
        }
        if (patchDTO.getCustomFields() != null) {
            task.setCustomFieldsMap(patchDTO.getCustomFields());
        }

        // Set last edited by
        task.setLastEditedBy(userId);

        Task savedTask = taskRepository.save(task);

        // Record history for changed fields
        recordTaskHistory(taskId, originalTitle, patchDTO.getTitle(), "title", userId);
        recordTaskHistory(taskId, originalDescription, patchDTO.getDescription(), "description", userId);
        recordTaskHistory(taskId, originalStatus != null ? originalStatus.toString() : null,
                         patchDTO.getStatus() != null ? patchDTO.getStatus().toString() : null, "status", userId);
        recordTaskHistory(taskId, originalPriority != null ? originalPriority.toString() : null,
                         patchDTO.getPriority() != null ? patchDTO.getPriority().toString() : null, "priority", userId);
        recordTaskHistory(taskId, originalAssigneeId != null ? originalAssigneeId.toString() : null,
                         patchDTO.getAssigneeId() != null ? patchDTO.getAssigneeId().toString() : null, "assigneeId", userId);
        recordTaskHistory(taskId, originalStartDate != null ? originalStartDate.toString() : null,
                         patchDTO.getStartDate() != null ? patchDTO.getStartDate().toString() : null, "startDate", userId);
        recordTaskHistory(taskId, originalDueDate != null ? originalDueDate.toString() : null,
                         patchDTO.getDueDate() != null ? patchDTO.getDueDate().toString() : null, "dueDate", userId);
        recordTaskHistory(taskId, originalTags != null ? originalTags.toString() : null,
                         patchDTO.getTags() != null ? patchDTO.getTags().toString() : null, "tags", userId);
        recordTaskHistory(taskId, originalCustomFields != null ? originalCustomFields.toString() : null,
                         patchDTO.getCustomFields() != null ? patchDTO.getCustomFields().toString() : null, "customFields", userId);

        // Convert to DTO
        return convertToDTO(savedTask);
    }

    @Transactional
    public BulkUpdateResponse bulkUpdateTasks(BulkUpdateRequest request, UUID userId) {
        List<UUID> successfulUpdates = new ArrayList<>();
        List<BulkUpdateError> failedUpdates = new ArrayList<>();

        for (UUID taskId : request.getTaskIds()) {
            try {
                TaskDTO updatedTask = patchTask(taskId, request.getUpdates(), userId);
                successfulUpdates.add(taskId);
            } catch (Exception e) {
                failedUpdates.add(new BulkUpdateError(taskId, e.getMessage(), "UPDATE_FAILED"));
            }
        }

        return new BulkUpdateResponse(
                successfulUpdates,
                failedUpdates,
                request.getTaskIds().size(),
                successfulUpdates.size(),
                failedUpdates.size()
        );
    }

    public List<TaskHistory> getTaskHistory(UUID taskId, UUID userId) {
        return taskHistoryRepository.findUserTaskHistory(taskId, userId);
    }

    private void recordTaskHistory(UUID taskId, String oldValue, String newValue, String fieldName, UUID userId) {
        if (oldValue == null && newValue == null) {
            return;
        }
        if (oldValue != null && oldValue.equals(newValue)) {
            return;
        }
        if (newValue != null && newValue.equals(oldValue)) {
            return;
        }

        TaskHistory history = new TaskHistory(
                taskId,
                fieldName,
                oldValue,
                newValue,
                userId,
                ChangeType.UPDATE,
                String.format("Changed %s from '%s' to '%s'", fieldName, oldValue, newValue)
        );

        taskHistoryRepository.save(history);
    }

    private TaskDTO convertToDTO(Task task) {
        TaskDTO taskDTO = new TaskDTO();
        taskDTO.setId(task.getId());
        taskDTO.setTitle(task.getTitle());
        taskDTO.setDescription(task.getDescription());
        taskDTO.setStatus(task.getStatus());
        taskDTO.setPriority(task.getPriority());
        taskDTO.setProjectId(task.getProjectId());
        taskDTO.setAssigneeId(task.getAssigneeId());
        taskDTO.setCreatedBy(task.getCreatedBy());
        taskDTO.setStartDate(task.getStartDate());
        taskDTO.setDueDate(task.getDueDate());
        taskDTO.setCreatedAt(task.getCreatedAt());
        taskDTO.setUpdatedAt(task.getUpdatedAt());
        
        // Set new fields
        taskDTO.setVersion(task.getVersion());
        taskDTO.setLastEditedBy(task.getLastEditedBy());
        taskDTO.setTags(task.getTagsList());
        taskDTO.setCustomFields(task.getCustomFieldsMap());

        // Set assignee
        if (task.getAssigneeId() != null) {
            User assignee = userRepository.findById(task.getAssigneeId()).orElse(null);
            if (assignee != null) {
                UserDTO assigneeDTO = new UserDTO(
                        assignee.getId(),
                        assignee.getEmail(),
                        assignee.getName(),
                        assignee.getAvatar()
                );
                taskDTO.setAssignee(assigneeDTO);
            }
        }

        // Set creator
        User creator = userRepository.findById(task.getCreatedBy()).orElse(null);
        if (creator != null) {
            UserDTO creatorDTO = new UserDTO(
                    creator.getId(),
                    creator.getEmail(),
                    creator.getName(),
                    creator.getAvatar()
            );
            taskDTO.setCreator(creatorDTO);
        }

        // Set last editor
        if (task.getLastEditedBy() != null) {
            User lastEditor = userRepository.findById(task.getLastEditedBy()).orElse(null);
            if (lastEditor != null) {
                UserDTO lastEditorDTO = new UserDTO(
                        lastEditor.getId(),
                        lastEditor.getEmail(),
                        lastEditor.getName(),
                        lastEditor.getAvatar()
                );
                taskDTO.setLastEditor(lastEditorDTO);
            }
        }

        return taskDTO;
    }
}