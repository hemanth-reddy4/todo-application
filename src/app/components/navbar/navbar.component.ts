import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  searchTerm:string = '';

  constructor(private authService: AuthService) {}

  @Output() searchTermChanged = new EventEmitter<string>();

  hamburgerRotated = true;
  profileMenuVisible = false;

  @Output() sidePanelToggle = new EventEmitter<boolean>();
  
  onSearch() {
    this.searchTermChanged.emit(this.searchTerm); // Emit the search term to the parent component
    console.log('searcj');
  }

  toggleHamburger() {
    this.hamburgerRotated = !this.hamburgerRotated;
    this.sidePanelToggle.emit(this.hamburgerRotated);
  }
  toggleProfileMenu() {
    this.profileMenuVisible = !this.profileMenuVisible;
  }

  goToSettings() {
    console.log('Navigating to Settings');
  }

  logout() {
    this.authService.logout();
  }
}
