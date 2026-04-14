import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.css',
})
export class NewsletterComponent {
  userEmail = '';
  isSubmitting = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  onSubmit(): void {
    if (!this.userEmail || !this.isValidEmail(this.userEmail)) {
      this.errorMessage.set('Please enter a valid email address');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    // Simulate API call
    setTimeout(() => {
      this.successMessage.set('Thank you for subscribing! Check your email for exclusive offers.');
      this.isSubmitting.set(false);
      this.userEmail = '';
    }, 1500);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
