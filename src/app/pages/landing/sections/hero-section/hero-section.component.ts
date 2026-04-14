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
import { RouterModule } from '@angular/router';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, RouterModule, ScrollRevealDirective],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css',
})
export class HeroSectionComponent implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);
  private parallaxTrigger: ScrollTrigger | undefined;
  private mouseMoveHandler: ((e: MouseEvent) => void) | null = null;

  stats = signal([
    { number: '200+', label: 'Bengal Weavers' },
    { number: '1200+', label: 'Cotton Crafts' },
    { number: '4.9★', label: 'Rating' },
    { number: '50+', label: 'Cities' },
  ]);

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    gsap.registerPlugin(ScrollTrigger);

    // Double rAF: ensure browser has painted before calculating positions.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const heroEl = this.el.nativeElement.querySelector('.hero-section');
        if (!heroEl?.isConnected) return;
        this.initParallax();
        this.initMouseTilt();
      });
    });
  }

  ngOnDestroy(): void {
    this.parallaxTrigger?.kill();
    if (this.mouseMoveHandler) {
      const hero = this.el.nativeElement.querySelector('.hero-section');
      if (hero) {
        hero.removeEventListener('mousemove', this.mouseMoveHandler);
      }
    }
  }

  /** Vertical scrub — hero image drifts upward as the user scrolls past. */
  private initParallax(): void {
    const imageContainer = this.el.nativeElement.querySelector('.hero-image-container');
    const blobs: HTMLElement[] = Array.from(
      this.el.nativeElement.querySelectorAll('.gradient-blob')
    );

    if (imageContainer) {
      // Use a GSAP tween with scrub — far more performant than gsap.set inside onUpdate
      gsap.to(imageContainer, {
        y: -80,
        rotateX: 6,
        transformPerspective: 1000,
        ease: 'none',
        scrollTrigger: {
          trigger: this.el.nativeElement.querySelector('.hero-section'),
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    }

    blobs.forEach((blob, i) => {
      const dir = i % 2 === 0 ? 1 : -1;
      gsap.to(blob, {
        y: 40 * dir,
        x: 20 * dir,
        ease: 'none',
        scrollTrigger: {
          trigger: this.el.nativeElement.querySelector('.hero-section'),
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    });
  }

  /**
   * Mouse-follow 3D tilt on the hero text container.
   * Rotates slightly toward the cursor, giving a "holographic label" feel.
   */
  private initMouseTilt(): void {
    const hero = this.el.nativeElement.querySelector('.hero-section') as HTMLElement;
    const textContainer = this.el.nativeElement.querySelector('.hero-text-container') as HTMLElement;
    const imageEl = this.el.nativeElement.querySelector('.hero-image') as HTMLElement;

    if (!hero || !textContainer) return;

    this.mouseMoveHandler = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      // Normalised mouse position [-1, 1]
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      gsap.to(textContainer, {
        rotateY: nx * 5,
        rotateX: -ny * 4,
        transformPerspective: 1200,
        duration: 1.2,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      if (imageEl) {
        gsap.to(imageEl, {
          rotateY: nx * 8,
          rotateX: -ny * 6,
          transformPerspective: 1200,
          duration: 1.2,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    };

    hero.addEventListener('mouseleave', () => {
      gsap.to([textContainer, imageEl].filter(Boolean), {
        rotateY: 0,
        rotateX: 0,
        duration: 1.2,
        ease: 'power2.inOut',
        overwrite: 'auto',
      });
    });

    hero.addEventListener('mousemove', this.mouseMoveHandler);
  }

  scrollToSection(sectionId: string): void {
    const element = document.querySelector(`#${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  onHeroImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    const wrapper = img.closest('.hero-image') as HTMLElement;
    if (wrapper) {
      wrapper.style.background =
        'linear-gradient(145deg, #570013 0%, #800020 50%, #a0002a 100%)';
      const placeholder = document.createElement('div');
      placeholder.className = 'hero-img-placeholder';
      placeholder.innerHTML = `
        <div style="text-align:center;color:rgba(255,255,255,0.5);padding:2rem;">
          <div style="font-size:4rem;margin-bottom:1rem;">🪔</div>
          <div style="font-family:'Noto Serif',serif;font-size:1rem;letter-spacing:0.1em;">
            Bengali Cotton Boutique
          </div>
        </div>`;
      wrapper.appendChild(placeholder);
    }
  }
}
