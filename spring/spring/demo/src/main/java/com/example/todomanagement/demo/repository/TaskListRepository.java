package com.example.todomanagement.demo.repository;

import com.example.todomanagement.demo.model.Task;
import com.example.todomanagement.demo.model.TaskList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TaskListRepository extends JpaRepository<TaskList, Long> {
    // Provides basic CRUD operations for TaskList entities
    List<TaskList> findByUserId(Long userId);
    List<TaskList> findByBoardIdAndUserId(Long boardId, Long userId);
    Optional<TaskList> findByIdAndUserId(Long id, Long userId);
}
