package com.example.todomanagement.demo.controller;

import com.example.todomanagement.demo.model.Board;
import com.example.todomanagement.demo.model.TaskList;
import com.example.todomanagement.demo.repository.TaskListRepository;
import com.example.todomanagement.demo.service.BoardService;
import com.example.todomanagement.demo.service.TaskListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController  // Marks this class as a REST controller
@RequestMapping("/tasklists")  // Maps HTTP requests to this controller to /tasklists
public class TaskListController {

    @Autowired
    private TaskListService taskListService;

    @Autowired
    private TaskListRepository taskListRepository;

    @Autowired
    private BoardService boardService;

    @GetMapping
    public ResponseEntity<List<TaskList>> getAllTaskLists(@RequestParam Long userId) {
        List<TaskList> taskLists = taskListService.getAllTaskLists(userId);
        System.out.println("called");
        System.out.println("called"); System.out.println("called"); System.out.println("called"); System.out.println("called"); System.out.println("called"); System.out.println("called"); System.out.println("called");
        return new ResponseEntity<>(taskLists, HttpStatus.OK);
    }

    @GetMapping("/{userId}/{boardId}")
    public ResponseEntity<List<TaskList>> getAllTaskListsById(@PathVariable Long userId,@PathVariable Long boardId) {
        List<TaskList> taskLists = taskListRepository.findByBoardIdAndUserId(boardId,userId);
        return new ResponseEntity<>(taskLists, HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Optional<TaskList>> getTaskListById(@PathVariable Long id, @RequestParam Long userId) {
        Optional<TaskList> taskList = taskListService.getTaskListById(id, userId);
        return taskList != null ? ResponseEntity.ok(taskList) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<TaskList> createTaskList(@RequestBody TaskList taskList, @RequestParam Long userId,@RequestParam Long boardId) {
        Optional<Board> board = boardService.getBoardById(boardId, userId);
        TaskList savedTaskList = taskListService.createTaskList(taskList, userId, board.get());
        return new ResponseEntity<>(savedTaskList, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskList> updateTaskList(@PathVariable Long id,@RequestParam Long userId,@RequestBody TaskList updatedTaskList){
        TaskList taskList = taskListService.updateTaskList(id,userId,updatedTaskList);
        return new ResponseEntity<>(taskList,HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTaskList(@PathVariable Long id, @RequestParam Long userId) {
        taskListService.deleteTaskList(id, userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
