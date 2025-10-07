package com.taskmanager.repository;

import com.taskmanager.model.TaskHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface TaskHistoryRepository extends JpaRepository<TaskHistory, UUID> {
    
    List<TaskHistory> findByTaskIdOrderByChangedAtDesc(UUID taskId);
    
    @Query("SELECT th FROM TaskHistory th WHERE th.taskId = :taskId AND " +
           "EXISTS (SELECT t FROM Task t WHERE t.id = th.taskId AND " +
           "EXISTS (SELECT p FROM Project p WHERE p.id = t.projectId AND " +
           "(p.ownerId = :userId OR EXISTS (SELECT pm FROM ProjectMember pm WHERE pm.projectId = p.id AND pm.userId = :userId))))")
    List<TaskHistory> findUserTaskHistory(@Param("taskId") UUID taskId, @Param("userId") UUID userId);
    
    @Query("SELECT th FROM TaskHistory th WHERE th.taskId = :taskId AND th.changedAt >= :startDate AND th.changedAt <= :endDate AND " +
           "EXISTS (SELECT t FROM Task t WHERE t.id = th.taskId AND " +
           "EXISTS (SELECT p FROM Project p WHERE p.id = t.projectId AND " +
           "(p.ownerId = :userId OR EXISTS (SELECT pm FROM ProjectMember pm WHERE pm.projectId = p.id AND pm.userId = :userId))))")
    List<TaskHistory> findUserTaskHistoryByDateRange(@Param("taskId") UUID taskId, @Param("startDate") LocalDateTime startDate, 
                                                     @Param("endDate") LocalDateTime endDate, @Param("userId") UUID userId);
    
    @Query("SELECT th FROM TaskHistory th WHERE th.taskId = :taskId AND th.fieldName = :fieldName AND " +
           "EXISTS (SELECT t FROM Task t WHERE t.id = th.taskId AND " +
           "EXISTS (SELECT p FROM Project p WHERE p.id = t.projectId AND " +
           "(p.ownerId = :userId OR EXISTS (SELECT pm FROM ProjectMember pm WHERE pm.projectId = p.id AND pm.userId = :userId))))")
    List<TaskHistory> findUserTaskHistoryByField(@Param("taskId") UUID taskId, @Param("fieldName") String fieldName, @Param("userId") UUID userId);
}