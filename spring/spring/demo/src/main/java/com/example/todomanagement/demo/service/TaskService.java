package com.example.todomanagement.demo.service;

import com.example.todomanagement.demo.model.Task;
import com.example.todomanagement.demo.model.TaskList;
import com.example.todomanagement.demo.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Service  // Marks this class as a Service component in Spring
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private TaskListService taskListService;



    // Get all tasks
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // Get a task by ID
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

//     Get tasks by ID
    public List<Task> getTasksByTaskListId(Long taskListId) {
        return taskRepository.findByTaskListId(taskListId);
    }
    // Create a new task
    public Task createTask(Task task, Long taskListId) {
        Optional<TaskList> temp_task = taskListService.getTaskList(taskListId);
        task.setTaskList(temp_task.get());
        return taskRepository.save(task);
    }

    public Task updateTask(Long taskListId, String title, Task updateTask){
        Optional<TaskList> temp_task = taskListService.getTaskList(taskListId);
        updateTask.setTaskList(temp_task.get());
        this.deleteTaskByTitle(taskListId,title);
        return taskRepository.save(updateTask);
    }
    // Delete a task by ID
    public void deleteTaskByTitle(Long taskListId,String title) {
        Optional<Task> task = taskRepository.findByTitleAndTaskListId(title,taskListId);
        if(task.isPresent()) {
            taskRepository.delete(task.get());
        }
        else{
            throw new IllegalArgumentException("Task with title '" + title + "' not found in the specified TaskList.");
        }
    }

}
