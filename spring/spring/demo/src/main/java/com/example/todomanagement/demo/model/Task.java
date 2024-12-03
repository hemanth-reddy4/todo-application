package com.example.todomanagement.demo.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.util.Date;

@Entity
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private Date date;
    private String tag;

    private boolean isCompleted;

    @ManyToOne
    @JoinColumn(name = "task_list_id", nullable = false)
    private TaskList taskList;

    // Getters and Setters

    @JsonProperty("isCompleted") // This ensures JSON key is "isCompleted"
    public boolean getIsCompleted() {
        return isCompleted;
    }

    @JsonProperty("isCompleted") // Maps incoming JSON key "isCompleted" to this setter
    public void setIsCompleted(boolean isCompleted) {
        this.isCompleted = isCompleted;
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public void setTaskList(TaskList taskList){
        this.taskList = taskList;
    }

    public TaskList getTaskList() {
        return taskList;
    }

}
