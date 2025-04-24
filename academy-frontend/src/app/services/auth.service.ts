import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private loggedInStatus = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedInStatus.asObservable();

  // Credenziali hardcoded per il test - mock values
  private validEmail = 'esempio@libero.it';
  private validPassword = '123';

  constructor() {
    console.log('AuthService Initialized. Logged In:', this.isLoggedIn());
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('simulated_auth_token');
  }

  isLoggedIn(): boolean {
    return this.loggedInStatus.value;
  }


  login(email: string, password?: string): boolean {
    if (email === this.validEmail && password === this.validPassword) {
      console.log('Login successful');
      localStorage.setItem('simulated_auth_token', 'true');
      this.loggedInStatus.next(true); 
      this.router.navigate(['/workers']);
      return true;
    } else {
      console.log('Login failed: Invalid credentials');
      this.loggedInStatus.next(false); 
      return false;
    }
  }

  logout(): void {
    console.log('Logging out');
    localStorage.removeItem('simulated_auth_token'); 
    this.loggedInStatus.next(false); 
    this.router.navigate(['/login']); 
  }
}
