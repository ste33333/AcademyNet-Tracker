import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm!: FormGroup;
  errorMessage: string | null = null;
  isLoading = false;

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
        console.log('User already logged in, redirecting from Login page...');
        this.router.navigate(['/workers']); 
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.errorMessage = null; 
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please enter a valid email and password.';
      this.loginForm.markAllAsTouched(); 
      return;
    }

    this.isLoading = true; 
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    const success = this.authService.login(email, password);

    this.isLoading = false; 

    if (!success) {
      this.errorMessage = 'Invalid credentials. Please try again.';
      this.loginForm.patchValue({ password: '' }); 
      this.loginForm.get('password')?.markAsUntouched(); 
    }
  }

  get f() { return this.loginForm.controls; }
}
