import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  isLoginMode = true;
  authForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    if (this.isLoginMode) {
      this.authForm.removeControl('name');
    } else {
      this.authForm.addControl('name', this.fb.control('', Validators.required));
    }
    this.authForm.reset();
  }

  onSubmit() {
    if (this.authForm.valid) {
      // Navigate to landing page on successful submission
      this.router.navigate(['/landing']);
    } else {
      this.authForm.markAllAsTouched();
    }
  }
}
