import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css',
})
export class HeroSectionComponent {
  stats = signal([
    { number: '15K+', label: 'Customers' },
    { number: '500+', label: 'Products' },
    { number: '4.9★', label: 'Rating' },
    { number: '24/7', label: 'Support' },
  ]);

  scrollToSection(sectionId: string): void {
    const element = document.querySelector(`#${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
