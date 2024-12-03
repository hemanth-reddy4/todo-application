import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isSignupMode = false;
  email: string = '';
  password: string = '';
  name: string = '';
  age: number | null = null;
  submitted = false;

  constructor(private authService: AuthService, private router: Router) {}

  toggleSignup() {
    this.isSignupMode = !this.isSignupMode;
  }

  onSubmit(): void {
    this.submitted = true;

    if (!this.isSignupMode) {
      // Login logic
      this.authService.login(this.email, this.password).subscribe(response => {
        localStorage.setItem('isLoggedIn', 'true');
        this.router.navigate(['/main']);
      }, error => {
        console.log(error);
        alert('Invalid login credentials');
      });
    } else {
      // Signup logic
      if (!this.isValid()) return; // Validate before sending signup request

      this.authService.signup(this.name, this.email, this.password, this.age!).subscribe(response => {
        alert('Signup successful! You can now log in.');
        this.toggleSignup(); // Switch to login mode
      }, error => {
      });
    }
  }

  isValid() {
    return (
      this.isEmailValid(this.email) &&
      this.password.length >= 8 &&
      (this.age !== null && this.age >= 12)
    );
  }

  isEmailValid(email: string): boolean {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    return emailPattern.test(email);
  }
}