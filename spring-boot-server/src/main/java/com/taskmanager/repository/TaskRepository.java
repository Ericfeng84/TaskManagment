package com.taskmanager.repository;

import com.taskmanager.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {
    
    List<Task> findByProjectIdOrderByCreatedAtDesc(UUID projectId);
    
    @Query("SELECT t FROM Task t WHERE t.id = :taskId AND " +
           "EXISTS (SELECT p FROM Project p WHERE p.id = t.projectId AND " +
           "(p.ownerId = :userId OR EXISTS (SELECT pm FROM ProjectMember pm WHERE pm.projectId = p.id AND pm.userId = :userId)))")
    java.util.Optional<Task> findUserTaskById(@Param("taskId") UUID taskId, @Param("userId") UUID userId);
    
    @Query("SELECT t FROM Task t WHERE t.projectId = :projectId AND " +
           "EXISTS (SELECT p FROM Project p WHERE p.id = t.projectId AND " +
           "(p.ownerId = :userId OR EXISTS (SELECT pm FROM ProjectMember pm WHERE pm.projectId = p.id AND pm.userId = :userId)))")
    List<Task> findProjectTasksByUser(@Param("projectId") UUID projectId, @Param("userId") UUID userId);
}