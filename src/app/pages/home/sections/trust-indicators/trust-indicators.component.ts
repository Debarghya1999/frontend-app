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

interface TrustIndicator {
  id: number;
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-trust-indicators',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trust-indicators.component.html',
  styleUrl: './trust-indicators.component.css',
})
export class TrustIndicatorsComponent implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);
  private scrollTrigger?: ScrollTrigger;

  indicators = signal<TrustIndicator[]>([
    {
      id: 1,
      icon: 'pi-sparkles',
      title: 'Premium Quality',
      description: 'Curated cotton pieces handcrafted by authentic Bengal weavers',
    },
    {
      id: 2,
      icon: 'pi-truck',
      title: 'Fast Delivery',
      description: 'Free shipping on orders over ₹1000, typically delivered in 3-5 days',
    },
    {
      id: 3,
      icon: 'pi-sync',
      title: 'Easy Returns',
      description: '30-day hassle-free returns and exchanges',
    },
    {
      id: 4,
      icon: 'pi-lock',
      title: 'Secure',
      description: 'Protected checkout and secure payment processing',
    },
  ]);

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    gsap.registerPlugin(ScrollTrigger);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.initStaggerCascade();
        this.initIconHoverSpring();
      });
    });
  }

  ngOnDestroy(): void {
    this.scrollTrigger?.kill();
  }

  /**
   * Framer Motion `whileInView` + `staggerChildren` equivalent:
   * Section header fades up first, then each card springs in from below
   * with staggered 80ms offsets. Icons use elastic.out for spring pop.
   */
  private initStaggerCascade(): void {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const sectionEl = this.el.nativeElement.querySelector('.trust-indicators') as HTMLElement;
    if (!sectionEl?.isConnected) return;

    // 1. Section header — flip-up first
    const headerChildren = [
      this.el.nativeElement.querySelector('.section-eyebrow'),
      this.el.nativeElement.querySelector('.section-title'),
      this.el.nativeElement.querySelector('.section-subtitle'),
    ].filter(Boolean);

    gsap.set(headerChildren, { opacity: 0, y: 28, scale: 0.97 });

    ScrollTrigger.create({
      trigger: this.el.nativeElement.querySelector('.section-header'),
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(headerChildren, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'back.out(1.5)',
        });
      },
    });

    // 2. Each indicator card — spring pop with stagger
    const cards: HTMLElement[] = Array.from(
      this.el.nativeElement.querySelectorAll('.indicator-card')
    );
    const icons: HTMLElement[] = Array.from(
      this.el.nativeElement.querySelectorAll('.indicator-icon')
    );

    // Pre-hide cards and squish icons
    gsap.set(cards, { opacity: 0, y: 45, scale: 0.88 });
    gsap.set(icons, { scale: 0, rotate: -15, opacity: 0 });

    this.scrollTrigger = ScrollTrigger.create({
      trigger: this.el.nativeElement.querySelector('.indicators-grid'),
      start: 'top 82%',
      once: true,
      onEnter: () => {
        // Cards cascade in
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.09,          // 90ms stagger — Framer Motion rhythm
          ease: 'back.out(1.6)',
          clearProps: 'scale',
        });

        // Icons spring pop with a slight delay after card appears
        gsap.to(icons, {
          scale: 1,
          rotate: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.09,
          delay: 0.1,
          ease: 'elastic.out(1, 0.5)',  // Framer spring physics
        });
      },
    });
  }

  /**
   * GSAP hover spring on each icon — mirrors Framer Motion `whileHover: { scale: 1.12 }`.
   * Uses `back.out` for the bounce-back effect.
   */
  private initIconHoverSpring(): void {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const cards: NodeListOf<HTMLElement> =
      this.el.nativeElement.querySelectorAll('.indicator-card');

    cards.forEach((card) => {
      const icon = card.querySelector('.indicator-icon') as HTMLElement;
      if (!icon) return;

      card.addEventListener('mouseenter', () => {
        gsap.to(icon, {
          scale: 1.18,
          rotate: 6,
          duration: 0.45,
          ease: 'back.out(2)',
          overwrite: 'auto',
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(icon, {
          scale: 1,
          rotate: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.5)',
          overwrite: 'auto',
        });
      });
    });
  }
}
