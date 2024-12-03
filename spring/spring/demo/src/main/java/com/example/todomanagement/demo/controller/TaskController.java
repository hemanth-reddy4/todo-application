package com.example.todomanagement.demo.controller;

import com.example.todomanagement.demo.model.Task;
import com.example.todomanagement.demo.model.TaskList;
import com.example.todomanagement.demo.service.TaskListService;
import com.example.todomanagement.demo.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController  // Marks this class as a REST controller
@RequestMapping("/tasks")  // Maps HTTP requests to this controller to /tasks
public class TaskController {

    @Autowired
    private TaskService taskService;
    @Autowired
    private TaskListService taskListService;

    // Get all tasks
    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    // Get a task by ID
    @GetMapping("/{id}")
    public Optional<Task> getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id);
    }

    @GetMapping("/list/{taskListId}")
    public List<Task> getTasksByTaskListId(@PathVariable Long taskListId) {
        return taskService.getTasksByTaskListId(taskListId);
    }

    // Create a new task
    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task, @RequestParam Long taskListId) {
        Task savedTask = taskService.createTask(task,taskListId);
        return new ResponseEntity<>(savedTask, HttpStatus.CREATED);
    }

    @PutMapping("/update/{taskListId}")
    public ResponseEntity<Task> updateTask(@PathVariable Long taskListId,@RequestParam String title,@RequestBody Task updateTask){
        Task task = taskService.updateTask(taskListId,title,updateTask);
        System.out.println("API CALLED");
        System.out.println(task.getTitle()+" "+task.getTag()+" "+task.getDate()+" "+task.getIsCompleted());
        System.out.println();
        return new ResponseEntity<>(task,HttpStatus.OK);
    }
    @DeleteMapping("/{taskListId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskListId, @RequestParam String title) {
        taskService.deleteTaskByTitle(taskListId, title);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
