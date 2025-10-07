package com.taskmanager.service;

import com.taskmanager.dto.TaskDTO;
import com.taskmanager.dto.UserDTO;
import com.taskmanager.model.*;
import com.taskmanager.repository.ProjectRepository;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

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
            taskDTO.setDueDate(task.getDueDate());
            taskDTO.setCreatedAt(task.getCreatedAt());
            taskDTO.setUpdatedAt(task.getUpdatedAt());

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

            return taskDTO;
        }).collect(Collectors.toList());
    }

    public TaskDTO createTask(UUID projectId, String title, String description, Priority priority, 
                             UUID assigneeId, UUID createdBy, java.time.LocalDateTime dueDate, UUID userId) {
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
        taskDTO.setDueDate(savedTask.getDueDate());
        taskDTO.setCreatedAt(savedTask.getCreatedAt());
        taskDTO.setUpdatedAt(savedTask.getUpdatedAt());

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
                             Priority priority, UUID assigneeId, java.time.LocalDateTime dueDate, UUID userId) {
        Task task = taskRepository.findUserTaskById(taskId, userId)
                .orElseThrow(() -> new RuntimeException("Task not found or access denied."));

        task.setTitle(title);
        task.setDescription(description);
        task.setStatus(status);
        task.setPriority(priority);
        task.setAssigneeId(assigneeId);
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
        taskDTO.setDueDate(updatedTask.getDueDate());
        taskDTO.setCreatedAt(updatedTask.getCreatedAt());
        taskDTO.setUpdatedAt(updatedTask.getUpdatedAt());

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
}