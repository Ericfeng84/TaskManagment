package com.taskmanager.repository;

import com.taskmanager.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {
    
    @Query("SELECT p FROM Project p WHERE p.ownerId = :userId OR " +
           "EXISTS (SELECT pm FROM ProjectMember pm WHERE pm.projectId = p.id AND pm.userId = :userId)")
    List<Project> findUserProjects(@Param("userId") UUID userId);
    
    @Query("SELECT p FROM Project p WHERE p.id = :projectId AND " +
           "(p.ownerId = :userId OR EXISTS (SELECT pm FROM ProjectMember pm WHERE pm.projectId = p.id AND pm.userId = :userId))")
    java.util.Optional<Project> findUserProjectById(@Param("projectId") UUID projectId, @Param("userId") UUID userId);
    
    @Query("SELECT p FROM Project p WHERE p.id = :projectId AND p.ownerId = :userId")
    java.util.Optional<Project> findOwnerProjectById(@Param("projectId") UUID projectId, @Param("userId") UUID userId);
}