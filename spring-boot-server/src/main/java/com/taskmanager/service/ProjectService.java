package com.taskmanager.service;

import com.taskmanager.dto.ProjectDTO;
import com.taskmanager.dto.ProjectMemberDTO;
import com.taskmanager.dto.TaskDTO;
import com.taskmanager.dto.UserDTO;
import com.taskmanager.model.*;
import com.taskmanager.repository.ProjectMemberRepository;
import com.taskmanager.repository.ProjectRepository;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectMemberRepository projectMemberRepository;

    public List<ProjectDTO> getUserProjects(UUID userId) {
        List<Project> projects = projectRepository.findUserProjects(userId);

        return projects.stream().map(project -> {
            ProjectDTO projectDTO = new ProjectDTO();
            projectDTO.setId(project.getId());
            projectDTO.setName(project.getName());
            projectDTO.setDescription(project.getDescription());
            projectDTO.setOwnerId(project.getOwnerId());
            projectDTO.setCreatedAt(project.getCreatedAt());
            projectDTO.setUpdatedAt(project.getUpdatedAt());

            // Set owner
            User owner = userRepository.findById(project.getOwnerId()).orElse(null);
            if (owner != null) {
                UserDTO ownerDTO = new UserDTO(
                        owner.getId(),
                        owner.getEmail(),
                        owner.getName(),
                        owner.getAvatar()
                );
                projectDTO.setOwner(ownerDTO);
            }

            // Set members with their avatars
            List<ProjectMember> members = projectMemberRepository.findByProjectId(project.getId());
            List<ProjectMemberDTO> memberDTOs = members.stream().map(member -> {
                ProjectMemberDTO memberDTO = new ProjectMemberDTO();
                memberDTO.setId(member.getId());
                memberDTO.setProjectId(member.getProjectId());
                memberDTO.setUserId(member.getUserId());
                memberDTO.setRole(member.getRole());
                memberDTO.setJoinedAt(member.getJoinedAt());

                User user = userRepository.findById(member.getUserId()).orElse(null);
                if (user != null) {
                    UserDTO userDTO = new UserDTO(
                            user.getId(),
                            user.getEmail(),
                            user.getName(),
                            user.getAvatar()
                    );
                    memberDTO.setUser(userDTO);
                }

                return memberDTO;
            }).collect(Collectors.toList());
            projectDTO.setMembers(memberDTOs);

            // Set tasks
            List<Task> tasks = taskRepository.findByProjectIdOrderByCreatedAtDesc(project.getId());
            List<TaskDTO> taskDTOs = tasks.stream().map(task -> {
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
            projectDTO.setTasks(taskDTOs);

            return projectDTO;
        }).collect(Collectors.toList());
    }

    public ProjectDTO createProject(String name, String description, UUID ownerId) {
        Project project = new Project(name, description, ownerId);
        Project savedProject = projectRepository.save(project);

        // Add owner as project member with OWNER role
        ProjectMember member = new ProjectMember(savedProject.getId(), ownerId, MemberRole.OWNER);
        projectMemberRepository.save(member);

        ProjectDTO projectDTO = new ProjectDTO();
        projectDTO.setId(savedProject.getId());
        projectDTO.setName(savedProject.getName());
        projectDTO.setDescription(savedProject.getDescription());
        projectDTO.setOwnerId(savedProject.getOwnerId());
        projectDTO.setCreatedAt(savedProject.getCreatedAt());
        projectDTO.setUpdatedAt(savedProject.getUpdatedAt());

        // Set owner
        User owner = userRepository.findById(savedProject.getOwnerId()).orElse(null);
        if (owner != null) {
            UserDTO ownerDTO = new UserDTO(
                    owner.getId(),
                    owner.getEmail(),
                    owner.getName(),
                    owner.getAvatar()
            );
            projectDTO.setOwner(ownerDTO);
        }

        return projectDTO;
    }

    public ProjectDTO getProjectById(UUID projectId, UUID userId) {
        Project project = projectRepository.findUserProjectById(projectId, userId)
                .orElseThrow(() -> new RuntimeException("Project not found or access denied."));

        ProjectDTO projectDTO = new ProjectDTO();
        projectDTO.setId(project.getId());
        projectDTO.setName(project.getName());
        projectDTO.setDescription(project.getDescription());
        projectDTO.setOwnerId(project.getOwnerId());
        projectDTO.setCreatedAt(project.getCreatedAt());
        projectDTO.setUpdatedAt(project.getUpdatedAt());

        // Set owner
        User owner = userRepository.findById(project.getOwnerId()).orElse(null);
        if (owner != null) {
            UserDTO ownerDTO = new UserDTO(
                    owner.getId(),
                    owner.getEmail(),
                    owner.getName(),
                    owner.getAvatar()
            );
            projectDTO.setOwner(ownerDTO);
        }

        // Set members
        List<ProjectMember> members = projectMemberRepository.findByProjectId(project.getId());
        List<ProjectMemberDTO> memberDTOs = members.stream().map(member -> {
            ProjectMemberDTO memberDTO = new ProjectMemberDTO();
            memberDTO.setId(member.getId());
            memberDTO.setProjectId(member.getProjectId());
            memberDTO.setUserId(member.getUserId());
            memberDTO.setRole(member.getRole());
            memberDTO.setJoinedAt(member.getJoinedAt());

            User user = userRepository.findById(member.getUserId()).orElse(null);
            if (user != null) {
                UserDTO userDTO = new UserDTO(
                        user.getId(),
                        user.getEmail(),
                        user.getName(),
                        user.getAvatar()
                );
                memberDTO.setUser(userDTO);
            }

            return memberDTO;
        }).collect(Collectors.toList());
        projectDTO.setMembers(memberDTOs);

        // Set tasks
        List<Task> tasks = taskRepository.findByProjectIdOrderByCreatedAtDesc(project.getId());
        List<TaskDTO> taskDTOs = tasks.stream().map(task -> {
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
        projectDTO.setTasks(taskDTOs);

        return projectDTO;
    }

    public ProjectDTO updateProject(UUID projectId, String name, String description, UUID userId) {
        Project project = projectRepository.findOwnerProjectById(projectId, userId)
                .orElseThrow(() -> new RuntimeException("Project not found or access denied."));

        project.setName(name);
        project.setDescription(description);
        Project updatedProject = projectRepository.save(project);

        ProjectDTO projectDTO = new ProjectDTO();
        projectDTO.setId(updatedProject.getId());
        projectDTO.setName(updatedProject.getName());
        projectDTO.setDescription(updatedProject.getDescription());
        projectDTO.setOwnerId(updatedProject.getOwnerId());
        projectDTO.setCreatedAt(updatedProject.getCreatedAt());
        projectDTO.setUpdatedAt(updatedProject.getUpdatedAt());

        // Set owner
        User owner = userRepository.findById(updatedProject.getOwnerId()).orElse(null);
        if (owner != null) {
            UserDTO ownerDTO = new UserDTO(
                    owner.getId(),
                    owner.getEmail(),
                    owner.getName(),
                    owner.getAvatar()
            );
            projectDTO.setOwner(ownerDTO);
        }

        return projectDTO;
    }

    public void deleteProject(UUID projectId, UUID userId) {
        Project project = projectRepository.findOwnerProjectById(projectId, userId)
                .orElseThrow(() -> new RuntimeException("Project not found or access denied."));

        projectRepository.delete(project);
    }
}