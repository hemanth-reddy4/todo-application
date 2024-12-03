import { Component, Input, HostListener, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent {
  @Input() title: string = 'This is a Simple Task';
  @Input() date: string | null = '';
  @Input() tag: string = '';
  @Input() isCompleted: boolean = false; // Track completion status
  @Input() onDelete!: (taskTitle: string) => void; // Use non-null assertion operator
  @Output() taskDuplicated = new EventEmitter<string>();
  @Output() recoverTask = new EventEmitter<string>();
  @Output() onEdit = new EventEmitter<void>();
  @Output() taskUpdated = new EventEmitter<{ title: string, date: string, tag: string }>(); // Event for updating task
  showOptions: boolean = false;
  isEditing: boolean = false; // Track if in edit mode
  editedTitle: string = ''; // Temporary variables for edit form
  editedDate: string = '';
  editedTag: string = '';

  toggleOptions() {
    this.showOptions = !this.showOptions;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const clickedInside = (event.target as HTMLElement).closest('.options');
    if (!clickedInside) {
      this.showOptions = false;
    }
  }

  recover() {
    console.log('Recovering task:', this.title);
    // Logic to recover the task can be implemented here
    this.recoverTask.emit(this.title); // Emit the title of the task to recover
  }

  editTask() {
    this.onEdit.emit();
  }

  saveEdit() {
    // Emit updated task details and exit edit mode
    this.taskUpdated.emit({ title: this.editedTitle, date: this.editedDate, tag: this.editedTag });
    this.isEditing = false;
  }

  cancelEdit() {
    this.isEditing = false;
  }
  duplicateTask() {
    this.taskDuplicated.emit(this.title);
  }

  // Method to handle the delete action
  deleteTask() {
    this.onDelete(this.title); // Call the passed delete function
  }

  getTagClass() {
    switch (this.tag) {
      case 'High':
        return 'high-priority';
      case 'Low':
        return 'low-priority';
      default:
        return '';
    }
  }
}
