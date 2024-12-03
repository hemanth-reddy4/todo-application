package com.example.todomanagement.demo.service;

import com.example.todomanagement.demo.model.Board;
import com.example.todomanagement.demo.model.User;
import com.example.todomanagement.demo.repository.BoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BoardService {
    private final BoardRepository boardRepository;

    public BoardService(BoardRepository boardRepository) {
        this.boardRepository = boardRepository;
    }

    public List<Board> getAllBoards(Long userId) {
        return boardRepository.findByUserId(userId);
    }

    public Optional<Board> getBoardById(Long id, Long userId) {
        return boardRepository.findByIdAndUserId(id, userId);
    }

    public Board saveBoard(Board board, Long userId) {
        User user = new User();
        user.setId(userId);
        board.setUser(user);
        return boardRepository.save(board);
    }

    public Board updateBoard(Long id, Long userId, Board updatedBoard) {
        Board existingBoard = boardRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Board not found"));

        // Only update the fields that can be modified
        existingBoard.setName(updatedBoard.getName());
        // Add any additional fields you want to update

        return boardRepository.save(existingBoard); // Save the updated board
    }

    public void deleteBoard(Long id, Long userId) {
        Board board = boardRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Board not found"));
        boardRepository.delete(board);
    }
}