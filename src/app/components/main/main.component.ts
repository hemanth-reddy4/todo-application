import { Component } from '@angular/core';
import { Board } from '../../interface/task-interface';
import { AuthService } from '../../services/auth.service';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  boards: Board[] = [];
  boardTitle = 'Main Board';
  isSidePanelOpen = true;
  isAddingBoard = false;
  newBoardName = '';
  selectedBoard: Board | null = null;
  searchTerm: string = '';
  userId: number | null = null; // Declare userId

  constructor(private authService: AuthService, private boardService: BoardService) { }

  ngOnInit(): void {
    // Subscribe to board updates
    this.boardService.boards$.subscribe((boards) => (this.boards = boards));
    this.boardService.selectedBoard$.subscribe((board) => (this.selectedBoard = board));

    // Fetch userId and boards for the current user
    this.userId = this.authService.getCurrentUserId(); // Use the method to get userId
    if (this.userId) {
      this.boardService.fetchBoardsByUserId(this.userId); // Ensure this method exists
    }
  }

  logout(): void {
    this.authService.logout();
    this.boardService.clearselectedBoard();
  }

  onSearchTermChanged(searchTerm: string): void {
    this.searchTerm = searchTerm; // Update the searchTerm in the parent component
    console.log("Search term received in parent:", this.searchTerm);
  }

  handleTaskListDeletion(event: { boardId: number; listId: number }): void {
    const { boardId, listId } = event;
    const board = this.boards.find(b => b.id === boardId);
    if (board) {
      // Filter out the deleted task list from the board's taskLists
      board.taskLists = board.taskLists.filter(taskList => taskList.id !== listId);
    }
  }

  editBoardTitle(updatedTitle: { id: number; title: string }): void {
    const board = this.boards.find((b) => b.id === updatedTitle.id);
    if (board) {
      board.name = updatedTitle.title;

      // Update selected board if applicable
      if (this.selectedBoard?.id === board.id) {
        this.selectedBoard.name = board.name;
      }

      // Update the board on the backend
      if (this.userId !== null) {
        this.boardService.updateBoard({ ...board, userId: this.userId });
      }
    } else {
      console.log(`Board with id ${updatedTitle.id} not found.`);
    }
  }

  deleteBoard(boardId: number): void {
    if (this.userId !== null) {
      this.boardService.deleteBoard(boardId, this.userId); // Pass both boardId and userId
      // Clear the selected board if it's the one being deleted
      if (this.selectedBoard?.id === boardId) {
        this.selectedBoard = null;
        this.boardTitle = 'Main Board'; // Reset the title or set it to a default
      }
    } else {
      console.error('User  ID is not available for deletion.');
    }
  }

  startAddingBoard(): void {
    this.isAddingBoard = true;
  }

  addBoard(): void {
    if (this.newBoardName.trim() && this.userId !== null) {
      const newBoard: Board = {
        id: 0, // ID will be assigned by the backend
        name: this.newBoardName,
        taskLists: [],
        userId: this.userId,
      };

      // Send the new board to the backend
      this.boardService.addBoard(newBoard, this.userId);

      // Reset UI states
      this.newBoardName = '';
      this.isAddingBoard = false;
    } else {
      console.error('New board name is empty or userId is not available.');
    }
  }
  toggleSidePanel(isOpen: boolean): void {
    this.isSidePanelOpen = isOpen;
  }

  // Select a board and update the board title
  selectBoard(board: Board): void {
    this.boardService.selectBoard(board);
    console.log('Selected Board:', board);
  }
}