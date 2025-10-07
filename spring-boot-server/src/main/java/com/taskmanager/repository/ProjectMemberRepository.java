package com.taskmanager.repository;

import com.taskmanager.model.ProjectMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProjectMemberRepository extends JpaRepository<ProjectMember, UUID> {
    
    List<ProjectMember> findByProjectId(UUID projectId);
    
    List<ProjectMember> findByUserId(UUID userId);
    
    boolean existsByProjectIdAndUserId(UUID projectId, UUID userId);
}