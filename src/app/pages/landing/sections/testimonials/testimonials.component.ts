import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  text: string;
  rating: number;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css',
  animations: [
    trigger('slideIn', [
      state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out'),
      ]),
    ]),
  ],
})
export class TestimonialsComponent {
  currentIndex = signal(0);

  testimonials = signal<Testimonial[]>([
    {
      id: 1,
      name: 'Sarah Mitchell',
      role: 'Fashion Entrepreneur',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80',
      text: 'The quality and attention to detail in every piece is exceptional. I\'ve never felt more confident in my wardrobe choices.',
      rating: 5,
    },
    {
      id: 2,
      name: 'James Chen',
      role: 'Corporate Executive',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80',
      text: 'Outstanding service and delivery. The boutique truly understands the meaning of luxury and exclusivity.',
      rating: 5,
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      role: 'Lifestyle Blogger',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80',
      text: 'Each collection tells a story. The pieces are versatile, elegant, and perfect for every occasion.',
      rating: 4.5,
    },
  ]);

  goToTestimonial(index: number): void {
    this.currentIndex.set(index);
  }
}
