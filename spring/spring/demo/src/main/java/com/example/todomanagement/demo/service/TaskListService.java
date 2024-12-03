package com.example.todomanagement.demo.service;

import com.example.todomanagement.demo.model.Board;
import com.example.todomanagement.demo.model.Task;
import com.example.todomanagement.demo.model.TaskList;
import com.example.todomanagement.demo.model.User;
import com.example.todomanagement.demo.repository.BoardRepository;
import com.example.todomanagement.demo.repository.TaskListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service  // Marks this class as a Service component in Spring
public class TaskListService {

    @Autowired
    private TaskListRepository taskListRepository;

    
    public List<TaskList> getAllTaskLists(Long userId) {
        return taskListRepository.findByUserId(userId);
    }

    public Optional<TaskList> getTaskList(Long id){
        return taskListRepository.findById(id);
    }

    public Optional<TaskList> getTaskListById(Long id, Long userId) {
        return taskListRepository.findByIdAndUserId(id, userId);
    }

    public TaskList createTaskList(TaskList taskList, Long userId, Board board) {
        User user = new User();
        user.setId(userId);
        taskList.setUser(user);
        taskList.setBoard(board);
        return taskListRepository.save(taskList);
    }

    public TaskList updateTaskList(Long id, Long userId, TaskList updatedTaskList) {
        TaskList existingTaskList = taskListRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Task List not found"));

        existingTaskList.setTitle(updatedTaskList.getTitle());

        return taskListRepository.save(existingTaskList);
    }
    public void deleteTaskList(Long id, Long userId) {
        TaskList taskList = taskListRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Task List not found"));
        taskListRepository.delete(taskList);
    }
}
