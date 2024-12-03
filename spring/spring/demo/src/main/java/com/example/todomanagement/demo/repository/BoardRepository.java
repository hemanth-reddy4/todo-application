package com.example.todomanagement.demo.repository;

import com.example.todomanagement.demo.model.Board;
import com.example.todomanagement.demo.model.TaskList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BoardRepository extends JpaRepository<Board, Long> {
    // Provides basic CRUD operations for Board entities
    List<Board> findByUserId(Long userId);
    Optional<Board> findByIdAndUserId(Long id, Long userId);
}
