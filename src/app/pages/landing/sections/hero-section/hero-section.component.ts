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
  private floatTimelines: gsap.core.Tween[] = [];

  stats = signal([
    { number: '200+', label: 'Bengal Weavers', target: 200, suffix: '+' },
    { number: '1200+', label: 'Cotton Crafts', target: 1200, suffix: '+' },
    { number: '4.9★', label: 'Rating', target: 49, suffix: '★', isDecimal: true },
    { number: '50+', label: 'Cities', target: 50, suffix: '+' },
  ]);

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    gsap.registerPlugin(ScrollTrigger);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const heroEl = this.el.nativeElement.querySelector('.hero-section');
        if (!heroEl?.isConnected) return;
        this.initStaggeredEntrance();
        this.initParallax();
        this.initMouseTilt();
        this.initBlobFloat();
        this.initStatCountUp();
      });
    });
  }

  ngOnDestroy(): void {
    this.parallaxTrigger?.kill();
    this.floatTimelines.forEach(t => t.kill());
    if (this.mouseMoveHandler) {
      const hero = this.el.nativeElement.querySelector('.hero-section');
      if (hero) hero.removeEventListener('mousemove', this.mouseMoveHandler);
    }
  }

  /**
   * Framer Motion-style staggered entrance on the hero text block.
   * Each child element enters sequentially with 80ms offset.
   */
  private initStaggeredEntrance(): void {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const targets = [
      this.el.nativeElement.querySelector('.hero-eyebrow'),
      this.el.nativeElement.querySelector('.hero-title'),
      this.el.nativeElement.querySelector('.hero-subtitle'),
      this.el.nativeElement.querySelector('.hero-cta-buttons'),
      this.el.nativeElement.querySelector('.hero-stats'),
    ].filter(Boolean);

    // Set initial hidden state on each element
    gsap.set(targets, { opacity: 0, y: 40, scale: 0.96 });

    // Stagger entrance — like Framer Motion `staggerChildren` + `variants`
    gsap.to(targets, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.85,
      stagger: 0.12,           // 120ms between each child — cinematic cascade
      ease: 'back.out(1.4)',   // slight spring overshoot — Framer Motion feel
      delay: 0.2,
      clearProps: 'scale',
    });
  }

  /**
   * Ambient floating animation on gradient blobs — continuous sinusoidal drift.
   * Each blob moves independently on a staggered loop (like Framer Motion `animate` with `repeat`).
   */
  private initBlobFloat(): void {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const blobConfigs = [
      { selector: '.blob-1', yAmt: 28, xAmt: 14, dur: 11 },
      { selector: '.blob-2', yAmt: -22, xAmt: 18, dur: 14 },
      { selector: '.blob-3', yAmt: 18, xAmt: -12, dur: 9 },
    ];

    blobConfigs.forEach(({ selector, yAmt, xAmt, dur }) => {
      const blob = this.el.nativeElement.querySelector(selector);
      if (!blob) return;
      const t = gsap.to(blob, {
        y: yAmt,
        x: xAmt,
        scale: 1.06,
        duration: dur,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
      this.floatTimelines.push(t);
    });
  }

  /**
   * Animated stat counter on scroll-enter — numbers count up from 0.
   * Mirrors Framer Motion `useMotionValue` + `animate` pattern.
   */
  private initStatCountUp(): void {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const statEls: NodeListOf<HTMLElement> = this.el.nativeElement.querySelectorAll('.stat-number');
    const statsData = this.stats();

    ScrollTrigger.create({
      trigger: this.el.nativeElement.querySelector('.hero-stats'),
      start: 'top 85%',
      once: true,
      onEnter: () => {
        statEls.forEach((el, i) => {
          const data = statsData[i];
          if (!data) return;

          if (data.isDecimal) {
            // e.g. 4.9★: count 0.0 → 4.9
            const proxy = { val: 0 };
            gsap.to(proxy, {
              val: 4.9,
              duration: 1.8,
              delay: i * 0.15,
              ease: 'power2.out',
              onUpdate: () => {
                el.textContent = proxy.val.toFixed(1) + data.suffix;
              },
            });
          } else {
            const proxy = { val: 0 };
            gsap.to(proxy, {
              val: data.target,
              duration: 1.6,
              delay: i * 0.15,
              ease: 'power2.out',
              onUpdate: () => {
                el.textContent = Math.round(proxy.val) + data.suffix;
              },
            });
          }
        });
      },
    });
  }

  /** Vertical scrub — hero image drifts upward as the user scrolls past. */
  private initParallax(): void {
    const imageContainer = this.el.nativeElement.querySelector('.hero-image-container');
    const blobs: HTMLElement[] = Array.from(
      this.el.nativeElement.querySelectorAll('.gradient-blob')
    );

    if (imageContainer) {
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
   */
  private initMouseTilt(): void {
    const hero = this.el.nativeElement.querySelector('.hero-section') as HTMLElement;
    const textContainer = this.el.nativeElement.querySelector('.hero-text-container') as HTMLElement;
    const imageEl = this.el.nativeElement.querySelector('.hero-image') as HTMLElement;

    if (!hero || !textContainer) return;

    this.mouseMoveHandler = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
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
