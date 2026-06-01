package com.taskboard.repository;

import com.taskboard.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserIdOrderById(Long userId);
    void deleteByUserId(Long userId);
}
