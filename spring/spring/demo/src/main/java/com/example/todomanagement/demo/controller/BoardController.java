package com.example.todomanagement.demo.controller;

import com.example.todomanagement.demo.model.Board;
import com.example.todomanagement.demo.service.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/boards")
public class BoardController {

    @Autowired
    private BoardService boardService;

    @GetMapping
    public ResponseEntity<List<Board>> getAllBoards(@RequestParam Long userId) {
        List<Board> boards = boardService.getAllBoards(userId);
        return new ResponseEntity<>(boards, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Board>> getBoardById(@PathVariable Long id, @RequestParam Long userId) {
        Optional<Board> board = boardService.getBoardById(id, userId);
        return board != null ? ResponseEntity.ok(board) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Board> createBoard(@RequestBody Board board, @RequestParam Long userId) {
        Board savedBoard = boardService.saveBoard(board, userId);
        return new ResponseEntity<>(savedBoard, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Board> updateBoard(
            @PathVariable Long id,
            @RequestParam Long userId,
            @RequestBody Board updatedBoard) {

        Board board = boardService.updateBoard(id, userId, updatedBoard);
        return new ResponseEntity<>(board, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBoard(@PathVariable Long id, @RequestParam Long userId) {
        boardService.deleteBoard(id, userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}