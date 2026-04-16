import {
  Component,
  signal,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
})
export class TestimonialsComponent implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);
  private scrollTriggerInstance?: ScrollTrigger;

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
    gsap.registerPlugin(ScrollTrigger);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.initSectionHeaderStagger();
        this.initCardStaggerEntrance();
        this.initCardTilt();
      });
    });
  }

  ngOnDestroy(): void {
    this.scrollTriggerInstance?.kill();
  }

  /**
   * Section header — staggered entrance matching the other sections.
   */
  private initSectionHeaderStagger(): void {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const children = [
      this.el.nativeElement.querySelector('.section-eyebrow'),
      this.el.nativeElement.querySelector('.section-title'),
      this.el.nativeElement.querySelector('.section-subtitle'),
    ].filter(Boolean);

    gsap.set(children, { opacity: 0, y: 28, scale: 0.97 });

    ScrollTrigger.create({
      trigger: this.el.nativeElement.querySelector('.section-header'),
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(children, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.75,
          stagger: 0.1,
          ease: 'back.out(1.5)',
        });
      },
    });
  }

  /**
   * Testimonial cards — staggered zoom-spring entrance.
   * Framer Motion equivalent: `initial={{ opacity: 0, scale: 0.9, y: 40 }}`
   * `whileInView={{ opacity: 1, scale: 1, y: 0 }}` with `staggerChildren: 0.15`.
   */
  private initCardStaggerEntrance(): void {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const grid = this.el.nativeElement.querySelector('.testimonials-grid') as HTMLElement;
    if (!grid) return;
    const cards: HTMLElement[] = Array.from(grid.querySelectorAll('.testimonial-card'));

    gsap.set(cards, { opacity: 0, y: 48, scale: 0.9 });

    this.scrollTriggerInstance = ScrollTrigger.create({
      trigger: grid,
      start: 'top 82%',
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,           // 150ms stagger — deliberate editorial pace
          ease: 'back.out(1.4)',   // spring overshoot — Framer Motion feel
          clearProps: 'scale',
        });

        // Stars animate in with a cheerful elastic pop after the cards
        const allStars: HTMLElement[] = Array.from(
          grid.querySelectorAll('.testimonial-rating i')
        );
        gsap.fromTo(allStars,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            stagger: 0.04,
            ease: 'elastic.out(1, 0.5)',
            delay: 0.5,
          }
        );
      },
    });
  }

  /**
   * Holographic card tilt — testimonial cards follow the mouse in 3D.
   */
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

  /**
   * Navigate to a testimonial dot with a Framer Motion-style crossfade.
   * The active card pulses with a fade-out/in + subtle scale.
   */
  goToTestimonial(index: number): void {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reduceMotion) {
      const cards: HTMLElement[] = Array.from(
        this.el.nativeElement.querySelectorAll('.testimonial-card')
      );
      // Crossfade: fade all out, update index, fade back in
      gsap.to(cards, {
        opacity: 0.4,
        scale: 0.97,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          this.currentIndex.set(index);
          gsap.to(cards, {
            opacity: 1,
            scale: 1,
            duration: 0.45,
            stagger: 0.08,
            ease: 'back.out(1.3)',
          });
        },
      });
    } else {
      this.currentIndex.set(index);
    }
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
