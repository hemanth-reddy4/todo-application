import { Component, EventEmitter, HostListener, Input, Output, SimpleChanges } from '@angular/core';
import { Task } from '../../interface/task-interface';
import { AuthService } from '../../services/auth.service';
import { BoardService } from '../../services/board.service';


@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent {
  @Input() listTitle: string = 'Task List';
  @Output() delete = new EventEmitter<void>();
  @Input() taskListId!: number;
  selectedTask: any;
  tasks: Task[] = [];
  
  showCompleted: boolean = false; // Flag to toggle completed tasks visibility

  // Task management state for adding and editing
  isAddingNewTask = false;
  isEditingTask = false; // State to track if editing a task
  editingTaskIndex: number | null = null; // To track which task is being edited

  newTaskTitle: string = '';
  newTaskDate: Date | null = null;
  newTaskPriority: string = 'Low'; // Default priority
  showOptions: boolean = false;

  @Output() titleUpdated = new EventEmitter<{ id: number, title: string }>();

  @Output() deleteTaskFromBoard = new EventEmitter<{ taskListId: number, taskTitle: string }>();

  isEditingTitle: boolean = false;
  newTitle: string = '';

  constructor(private boardService: BoardService) { }
  
  ngOnInit() {
    this.boardService.fetchTasksById(this.taskListId).subscribe(tasks => {
        this.tasks = tasks; // Update the local tasks array
    });
}
  fetchTasks() {
    if (this.taskListId) {
      this.boardService.fetchTasksById(this.taskListId).subscribe(tasks => {
        this.tasks = tasks; // Make sure you are updating the local tasks array here.
    });
    }
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['taskListId']) {
      this.fetchTasks();
    }
  }
  

  onEditTitle() {
    this.isEditingTitle = true;
    this.newTitle = this.listTitle;
  }

  confirmTitleUpdate() {
    this.isEditingTitle = false;
    this.titleUpdated.emit({ id: this.taskListId, title: this.newTitle });
  }


  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const clickedInside = (event.target as HTMLElement).closest('.options');
    if (!clickedInside) {
      this.showOptions = false;
    }
  }
  toggleOptions() {
    this.showOptions = !this.showOptions;
  }
  deleteTaskList() {
    this.delete.emit();
  }
  // Add a new task input field
  addTaskField() {
    this.resetNewTaskFields();
    this.isAddingNewTask = true;
    this.isEditingTask = false; // Ensure not in edit mode
  }
  // Hide task input field if nothing is entered
  hideTaskField() {
    if (!this.newTaskTitle && !this.newTaskDate && !this.newTaskPriority) {
      this.isAddingNewTask = false;
    }
  }

  // Save a new task or update an existing task
  saveTask() {
    if (this.newTaskTitle.trim() === '') {
      alert('Task title is required');
      return;
    }

    if (this.isEditingTask && this.editingTaskIndex !== null) {
      // Update the existing task
      this.tasks[this.editingTaskIndex] = {
        title: this.newTaskTitle,
        date: this.newTaskDate || new Date(),
        tag: this.newTaskPriority,
        isEditing: false,
        isCompleted: false
      };
      this.isEditingTask = false;
      this.editingTaskIndex = null;
    } else {
      // Adding a new task
      const duplicate = this.tasks.find(task => task.title === this.newTaskTitle);
      if (duplicate) {
        alert('Task with this title already exists.');
        return;
      }

      const newTask = {
        title: this.newTaskTitle,
        date: this.newTaskDate || new Date(),
        tag: this.newTaskPriority,
        isEditing: false,
        isCompleted: false
      };
      const { isEditing, ...taskToSend } = newTask;

        this.boardService.addTask(this.taskListId, taskToSend); // Send only necessary fields
        this.tasks.push(newTask);
    }

    this.resetNewTaskFields();
  }

  // Reset task input fields
  resetNewTaskFields() {
    this.newTaskTitle = '';
    this.newTaskDate = null;
    this.newTaskPriority = 'Low';
    this.isAddingNewTask = false;
  }

  // Mark a task as completed
  selectTask(task: any) {
    task.isCompleted=!task.isCompleted;
    const updatedTask = {
      title: task.title,
      date: task.date,
      tag: task.tag,
      isCompleted: task.isCompleted
    }
    console.log(updatedTask)
    this.boardService.updateTask(this.taskListId, updatedTask,task.title);
  }

  // Duplicate a task
 // Duplicate a task
duplicateTask(taskTitle: string) {
  // Find the task to duplicate by its title
  const taskToDuplicate = this.tasks.find(task => task.title === taskTitle);

  if (taskToDuplicate) {
    // Manually copy each property of the task
    const duplicatedTask = {
      title: `${taskToDuplicate.title} (Copy)`,  // Modify title to indicate duplicate
      date: taskToDuplicate.date,  // Copy the date
      tag: taskToDuplicate.tag,  // Copy the tag
      isCompleted: taskToDuplicate.isCompleted,  // Copy the completion status
      isEditing: false,  // Reset editing status
    };

    // Optionally, reset any values that shouldn't be copied (e.g., set isCompleted to false)
    // duplicatedTask.isCompleted = false;

    // Add the duplicated task to the frontend list
    this.tasks.push(duplicatedTask);

    // Send the duplicated task to the backend (assumes addTask correctly handles the request)
    const { isEditing, ...taskToSend } = duplicatedTask; // Remove unnecessary fields for backend
    this.boardService.addTask(this.taskListId, taskToSend);

    // Log the duplication for debugging
    console.log(`Duplicated task: ${duplicatedTask.title}`);
  } else {
    console.error('Task not found for duplication:', taskTitle);
  }
}


  // Recover a task from completed to active tasks
  recoverTask(taskTitle: string) {
    const taskToRecover = this.tasks.find(task => task.title === taskTitle);
    if (taskToRecover) {
      taskToRecover.isCompleted = false;
      const {isEditing, ...updatedTask} = taskToRecover;
      this.boardService.updateTask(this.taskListId,updatedTask,taskToRecover.title)
    }
  }

  // Delete a task from active or completed list
  deleteTask(taskTitle: string) {
    const taskExistsInActive = this.tasks.some(task => task.title === taskTitle);
    if (taskExistsInActive) {
      this.tasks = this.tasks.filter(task => task.title !== taskTitle);
      this.boardService.deleteTask(this.taskListId,taskTitle);
    } 
  }

  // Toggle visibility of completed tasks
  toggleCompleted() {
    this.showCompleted = !this.showCompleted;
    
  }

  // Edit an existing task
  editTask(index: number) {
    const task = this.tasks[index];
    this.newTaskTitle = task.title;
    this.newTaskDate = task.date;
    this.newTaskPriority = task.tag;
    this.isEditingTask = true;
    this.editingTaskIndex = index;

    // Remove the task from the list for editing
    this.tasks[index].isEditing = true; // Mark the task as being edited
  }

  // Function to update the task (after editing)
  updateTask() {
    // Check if the title is empty
    if (!this.newTaskTitle || this.newTaskTitle.trim() === '') {
      alert("Task title cannot be empty."); // Or use any other form of user feedback
      return; // Exit the function if title is empty
    }

    const duplicate = this.tasks.find(task => task.title === this.newTaskTitle);
    // Proceed with updating the task if the title is valid
    if (this.editingTaskIndex !== null) {
      const oldTitle = this.tasks[this.editingTaskIndex].title;

      this.tasks[this.editingTaskIndex] = {
        title: this.newTaskTitle,
        date: this.newTaskDate || new Date(),
        tag: this.newTaskPriority,
        isEditing: false,
        isCompleted:false
      };

      console.log(this.tasks[this.editingTaskIndex]);
      const {isEditing, ...updatedTask} = this.tasks[this.editingTaskIndex];

      this.boardService.updateTask(this.taskListId,updatedTask,oldTitle);

    }
    this.isEditingTask = false;
    this.editingTaskIndex = null;
    this.resetNewTaskFields();
  }

}
