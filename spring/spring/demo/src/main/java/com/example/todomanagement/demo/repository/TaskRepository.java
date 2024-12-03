package com.example.todomanagement.demo.repository;

import com.example.todomanagement.demo.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByTaskListId(Long taskListId);
    Optional<Task> findByTitleAndTaskListId(String title, Long taskListId);
    // Provides basic CRUD operations for Task entities
}
