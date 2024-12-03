import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth'; // Update to your Spring Boot authentication endpoint

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        // Assuming response contains user data
        const user = { 
          id: response.userId, 
          email: response.email,
          name: response.name, // Add other properties as needed
          // Add more properties from the response as needed
        };
        localStorage.setItem('user', JSON.stringify(user)); // Store user in local storage
        localStorage.setItem('isLoggedIn', 'true'); // Set login status
      })
    );
  }
  
  signup(name: string, email: string, password: string, age: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, { name, email, password, age });
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }

  getCurrentUserId(): number | null {
    const user = JSON.parse(localStorage.getItem('user') || '{}'); // Retrieve user from local storage
    return user.id || null; // Return the user ID or null if not found
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
}