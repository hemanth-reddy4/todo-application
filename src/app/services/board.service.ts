import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { BackendTask, Board, Task, TaskList } from '../interface/task-interface';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private apiUrl = 'http://localhost:8080/api/boards'; // Backend API base URL

  private taskListApiUrl = 'http://localhost:8080/tasklists'; // Backend TaskList API URL

  private taskUrl = 'http://localhost:8080/tasks';
  // State management
  private boardsSubject = new BehaviorSubject<Board[]>([]);
  boards$ = this.boardsSubject.asObservable();

  private selectedBoardSubject = new BehaviorSubject<Board | null>(null);
  selectedBoard$ = this.selectedBoardSubject.asObservable();

  private taskListSubject = new BehaviorSubject<TaskList[]>([]);
  taskLists$ = this.taskListSubject.asObservable();

  private taskSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.taskSubject.asObservable();

  constructor(private http: HttpClient) { }

  clearselectedBoard(){
    this.selectedBoardSubject.next(null);
  }
  fetchBoardsByUserId(userId: number) {
    this.http.get<Board[]>(`${this.apiUrl}?userId=${userId}`).subscribe((boards) => {
      this.boardsSubject.next(boards);
    });
  }

  selectBoard(board: Board) {
    this.selectedBoardSubject.next(board);
  }

  addBoard(board: Board, userId: number) {
    this.http.post<Board>(`${this.apiUrl}?userId=${userId}`, board).subscribe(() => {
      this.fetchBoardsByUserId(userId);
    });
  }


  updateBoard(board: Board) {
    this.http.put<Board>(`${this.apiUrl}/${board.id}?userId=${board.userId}`, board).subscribe(
      (updatedBoard) => {
        this.fetchBoardsByUserId(board.userId); // Refresh the boards list after update
      },
      (error) => {
        console.error('Error updating board:', error);
      }
    );
  }


  deleteBoard(id: number, userId: number) {
    this.http
      .delete(`${this.apiUrl}/${id}?userId=${userId}`)  // Add userId as query parameter
      .subscribe(() => {
        this.fetchBoardsByUserId(userId); 
        this.taskListSubject.next([]);
      });
  }

  fetchTaskListsById(userId: number, boardId: number) {
    this.http.get<TaskList[]>(`${this.taskListApiUrl}/${userId}/${boardId}`).subscribe(
      (taskLists) => {
        this.taskListSubject.next(taskLists); // Updates the BehaviorSubject
      },
      (error) => {
        console.error('Error fetching task lists:', error); // Log errors for debugging
      }
    );
  }



  addTaskList(boardId: number, taskList: TaskList, userId: number) {
    this.http.post<TaskList>(`${this.taskListApiUrl}?userId=${userId}&boardId=${boardId}`, taskList)
      .subscribe((newTaskList) => {
        this.fetchTaskListsById(userId, boardId); // Fetch updated task lists after adding a new one
        console.log(newTaskList); // Log the new task list for debugging
      }, error => {
        console.error('Error creating task list:', error); // Handle errors
      });
  }

  updateTaskList(taskList: TaskList) {
    this.http.put<TaskList>(`${this.taskListApiUrl}/${taskList.id}?userId=${taskList.userId}`, taskList)
      .subscribe(
        (updatedTaskList) => {
          this.fetchBoardsByUserId(taskList.userId); // Refresh the boards list
          console.log('Task list updated:', updatedTaskList);
        },
        (error) => {
          console.error('Error updating task list:', error);
        }
      );
  }

  deleteTaskList(id: number, userId: number, boardId: number) {
    this.http
      .delete(`${this.taskListApiUrl}/${id}?userId=${userId}`) // Add userId as query parameter
      .subscribe(
        () => {
          // Handle any specific logic if needed after deletion
          this.fetchTaskListsById(userId, boardId);
          console.log(`Task list with id ${id} deleted successfully.`);
        },
        (error) => {
          console.error('Error deleting task list:', error);
        }
      );
  }
  fetchTasksById(taskListId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.taskUrl}/list/${taskListId}`).pipe(
      tap(tasks => {
        this.taskSubject.next(tasks); // Update the BehaviorSubject
      })
    );
  }
  addTask(taskListId: number, task: BackendTask) {
    this.http.post<Task>(`${this.taskUrl}?taskListId=${taskListId}`, task)
      .subscribe((newTask) => {
        this.fetchTasksById(taskListId).subscribe();
      }, error => {
        console.error('Error creating task:', error);
      });
  }

  updateTask(taskListId: number, task: BackendTask, oldTitle: string) {
    console.log('Payload sent to backend:', JSON.stringify(task));
    this.http.put<Task>(`${this.taskUrl}/update/${taskListId}?title=${oldTitle}`, task)
      .subscribe(
        (newTask) => {
          console.log('Task updated successfully:', newTask); // Log or handle the updated task
          this.fetchTasksById(taskListId).subscribe(); // Optionally refresh the tasks list
        },
        (error) => {
          console.error('Error updating task:', error); // Log any errors
        }
      );
  }
  
  deleteTask(taskListId: number, title: string) {
    this.http
      .delete(`${this.taskUrl}/${taskListId}?title=${title}`) // Add userId as query parameter
      .subscribe(
        () => {
          // Handle any specific logic if needed after deletion
        },
        (error) => {
          console.error('Error deleting task list:', error);
        }
      );
  }
}