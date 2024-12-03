import { Component, EventEmitter, HostListener, Input, Output, SimpleChanges } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { Board, Task, TaskList } from '../../interface/task-interface';
import { BoardService } from '../../services/board.service';
import { AuthService } from '../../services/auth.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {
  @Input() board!: Board;
  @Input() id: number = 0;
  @Input() boardTitle: string = 'Board';

  @Output() titleUpdate = new EventEmitter<{ id: number, title: string }>();

  @Output() taskListDeleted = new EventEmitter<{ boardId: number, listId: number }>();

  @Input() searchTerm: string = ''; // Get the search term from parent

  newTitle: string = '';

  isEditing = false;   // Controls editing state

  newTaskTitle = '';    // Holds the new task title

  isEditingTitle = false;

  taskLists: TaskList[] = [];


  @Output() delete = new EventEmitter<number>();

  showOptions = false;

  @Input() userId: number | null = null;

  constructor(private authService: AuthService, private boardService: BoardService) { }

  ngOnInit() {
    this.userId = this.authService.getCurrentUserId();
    this.boardService.taskLists$.subscribe((taskLists: TaskList[]) => {
      this.taskLists = taskLists;
    });
  }
  fetchTaskLists() {
    if (this.userId && this.id) {
      this.boardService.fetchTaskListsById(this.userId, this.id);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchTerm']) {
      this.filterTaskLists(); // Apply filtering when searchTerm changes
    }
    if (changes['id'] && this.id) {
      this.fetchTaskLists();
    }
  }
  filteredTaskLists: TaskList[] = [];

  filterTaskLists() {
    if (!this.searchTerm) {
      this.filteredTaskLists = this.taskLists;
    } else {
      this.filteredTaskLists = this.taskLists.filter(taskList => taskList.title.toLowerCase().includes(this.searchTerm.toLowerCase()));
    }
  }

  confirmTitleUpdate() {
    this.isEditingTitle = false;
    this.titleUpdate.emit({ id: this.id, title: this.newTitle });
  }

  deleteBoard() {
    this.delete.emit(this.id);
  }
  onEditTitle() {
    this.isEditingTitle = true;
    this.newTitle = this.boardTitle;
  }
  toggleOptions() {
    this.showOptions = !this.showOptions;
  }
  startEditing() {
    this.isEditing = true;  // Show input field
  }

  // board.component.ts

  addTaskList() {
    if (this.newTaskTitle.trim() && this.userId !== null) {
      // Check if the task list with the same title already exists
      const taskListExists = this.taskLists.some(list => list.title.toLowerCase() === this.newTaskTitle.trim().toLowerCase());

      if (taskListExists) {
        alert('A task list with this title already exists.');
        return; // Stop execution if the list already exists
      }

      const newTaskList: TaskList = {
        id: 0, // or any default id, will be assigned by the backend
        title: this.newTaskTitle,
        tasks: [], // New task list, initially empty
        userId: this.userId,
      };

      // Call the BoardService to create the task list on the backend
      this.boardService.addTaskList(this.id, newTaskList, this.userId);

      console.log(this.taskLists);

      // Reset the input field and stop editing
      this.newTaskTitle = '';
      this.isEditing = false;
    }
  }

  deleteTaskList(listId: number): void {
    if (this.userId != null) {
      this.boardService.deleteTaskList(listId, this.userId,this.id);
    }

  }

  // Listen for clicks outside the input field to close it
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const clickedInsideInput = (event.target as HTMLElement).closest('.task-list-input');
    const clickedInsideButton = (event.target as HTMLElement).closest('.add-task-list-btn');

    // Close the input field if clicked outside both the input field and the button
    if (!clickedInsideInput && !clickedInsideButton && this.isEditing) {
      this.isEditing = false;
    }
  }
  onTitleUpdated(updatedTitle: { id: number; title: string }) {
    const taskList = this.taskLists.find(list => list.id === updatedTitle.id);

    if (taskList) {
      taskList.title = updatedTitle.title; // Update the title in the task list array

      // Update the task list on the backend
      if (this.userId !== null) {
        this.boardService.updateTaskList({ ...taskList, userId: this.userId });
      }
    } else {
      console.log(`TaskList with id ${updatedTitle.id} not found.`);
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const clickedInside = (event.target as HTMLElement).closest('.board-options');
    if (!clickedInside) {
      this.showOptions = false;
    }
  }

  onTaskDeleted(event: { taskListId: number, taskTitle: string }) {
    const taskList = this.taskLists.find(list => list.id === event.taskListId);
    if (taskList) {
      taskList.tasks = taskList.tasks.filter(task => task.title !== event.taskTitle);
    }
  }
  updateTaskList(updatedList: TaskList): void {
    const index = this.board.taskLists.findIndex((list) => list.id === updatedList.id);
    if (index !== -1) {
      this.board.taskLists[index] = updatedList;
      this.boardService.updateBoard(this.board); // Update the entire board
    }
  }
}
