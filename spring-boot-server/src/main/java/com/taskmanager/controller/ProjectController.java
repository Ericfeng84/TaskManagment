package com.taskmanager.controller;

import com.taskmanager.dto.ProjectDTO;
import com.taskmanager.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    private UUID getCurrentUserId(Authentication authentication) {
        return UUID.fromString(authentication.getName());
    }

    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getProjects(Authentication authentication) {
        try {
            UUID userId = getCurrentUserId(authentication);
            List<ProjectDTO> projects = projectService.getUserProjects(userId);
            return ResponseEntity.ok(projects);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<ProjectDTO> createProject(@RequestBody Map<String, String> request, Authentication authentication) {
        try {
            UUID userId = getCurrentUserId(authentication);
            String name = request.get("name");
            String description = request.get("description");
            
            ProjectDTO project = projectService.createProject(name, description, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(project);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> getProject(@PathVariable UUID id, Authentication authentication) {
        try {
            UUID userId = getCurrentUserId(authentication);
            ProjectDTO project = projectService.getProjectById(id, userId);
            return ResponseEntity.ok(project);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectDTO> updateProject(@PathVariable UUID id, @RequestBody Map<String, String> request, Authentication authentication) {
        try {
            UUID userId = getCurrentUserId(authentication);
            String name = request.get("name");
            String description = request.get("description");
            
            ProjectDTO project = projectService.updateProject(id, name, description, userId);
            return ResponseEntity.ok(project);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteProject(@PathVariable UUID id, Authentication authentication) {
        try {
            UUID userId = getCurrentUserId(authentication);
            projectService.deleteProject(id, userId);
            return ResponseEntity.ok(Map.of("message", "Project deleted successfully."));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}