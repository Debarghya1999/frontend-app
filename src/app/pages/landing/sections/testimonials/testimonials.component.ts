import { Component, signal, AfterViewInit, ElementRef, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';
import gsap from 'gsap';

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
  imports: [CommonModule, ScrollRevealDirective],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css',
})
export class TestimonialsComponent implements AfterViewInit {
  private el = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);

  currentIndex = signal(0);

  testimonials = signal<Testimonial[]>([
    {
      id: 1,
      name: 'Priya Sharma',
      role: 'Handloom Enthusiast',
      image: 'https://picsum.photos/seed/priya-sharma/100/100',
      text: 'The Jamdani cotton saree I ordered was breathtaking. The handwoven motifs are exactly as pictured — rich, lightweight, and utterly timeless.',
      rating: 5,
    },
    {
      id: 2,
      name: 'Arjun Mehta',
      role: 'Corporate Executive, Mumbai',
      image: 'https://picsum.photos/seed/arjun-mehta/100/100',
      text: 'My Bengali cotton panjabi from this boutique received so many compliments during pujo. The craftsmanship and comfort are truly world-class.',
      rating: 5,
    },
    {
      id: 3,
      name: 'Ananya Krishnan',
      role: 'Fashion & Culture Blogger',
      image: 'https://picsum.photos/seed/ananya-krishnan/100/100',
      text: 'I\'ve ordered three cotton kurtis and each one has been more stunning than the last. The breathable fabric and elegant cuts are unmatched anywhere online.',
      rating: 5,
    },
  ]);

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.initCardTilt();
  }

  /** Holographic card tilt — testimonial cards follow the mouse in 3D. */
  private initCardTilt(): void {
    const cards: NodeListOf<HTMLElement> =
      this.el.nativeElement.querySelectorAll('.testimonial-card');

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        gsap.to(card, {
          rotateY: nx * 12,
          rotateX: -ny * 8,
          z: 25,
          transformPerspective: 900,
          duration: 1.2,
          ease: 'sine.out',
        });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateY: 0,
          rotateX: 0,
          z: 0,
          duration: 2.0,
          ease: 'sine.inOut',
        });
      });
    });
  }

  goToTestimonial(index: number): void {
    this.currentIndex.set(index);
  }

  onAvatarError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    const wrapper = img.closest('.testimonial-author') as HTMLElement;
    if (wrapper) {
      const initials = img.alt.split('—')[0].trim().split(' ')
        .map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
      const avatar = document.createElement('div');
      avatar.className = 'author-avatar-fallback';
      avatar.textContent = initials;
      wrapper.prepend(avatar);
    }
  }
}
