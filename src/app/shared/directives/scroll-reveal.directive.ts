import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  AfterViewInit,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export type SrAnimation =
  | 'fade-up'
  | 'tilt-in'
  | 'flip-up'
  | 'zoom-drift'
  | 'slide-left'
  | 'slide-right';

/**
 * ScrollRevealDirective — Cinematic GSAP Edition
 *
 * Each animation variant is a multi-step GSAP Timeline with overshoot,
 * bloom, and perspective-correct 3D motion. Animations re-play on every
 * scroll-in / scroll-out cycle via ScrollTrigger toggleActions.
 *
 * Usage:
 *   <div [srAnimation]="'zoom-drift'" [srDelay]="200" [srThreshold]="0.12">…</div>
 */
@Directive({
  selector: '[srAnimation]',
  standalone: true,
})
export class ScrollRevealDirective implements AfterViewInit, OnDestroy {
  /** The animation variant. */
  @Input() srAnimation: SrAnimation = 'fade-up';

  /** Delay before the animation starts (ms). */
  @Input() srDelay: number = 0;

  /** Duration of the main animation phase (ms). */
  @Input() srDuration: number = 1800;

  /**
   * Fraction of the element that must be visible before the animation fires.
   * 0 = fires as soon as 1px is visible; 1 = requires full visibility.
   */
  @Input() srThreshold: number = 0.12;

  private el = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);
  private timeline: gsap.core.Timeline | null = null;
  private scrollTriggerInstance: ScrollTrigger | undefined;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    gsap.registerPlugin(ScrollTrigger);

    // Double rAF: wait for the browser to paint and compute layout.
    // Without this, ScrollTrigger records wrong element positions when
    // Angular re-creates components during client-side (SPA) navigation.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.initAnimation();
      });
    });
  }

  ngOnDestroy(): void {
    this.scrollTriggerInstance?.kill();
    this.timeline?.kill();
    // Reset all GSAP inline styles so the element is fully visible
    // if Angular re-uses or inspects the node after route teardown.
    gsap.set(this.el.nativeElement, { clearProps: 'all' });
  }

  // Called after the browser has painted — safe to calculate positions.
  private initAnimation(): void {
    const el: HTMLElement = this.el.nativeElement;

    // Guard: component may have been destroyed before the rAFs resolved.
    if (!el.isConnected) return;

    const dur = this.srDuration / 1000;
    const delay = this.srDelay / 1000;

    // Respect OS-level reduced-motion preference.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(el, { opacity: 1, clearProps: 'all' });
      return;
    }

    // Build the cinematic timeline for this element.
    this.timeline = this.buildTimeline(el, dur, delay);

    // Attach ScrollTrigger — replays on every scroll-in/out cycle.
    this.scrollTriggerInstance = ScrollTrigger.create({
      trigger: el,
      start: `top ${Math.round((1 - this.srThreshold) * 100)}%`,
      end: 'bottom 5%',
      onEnter:     () => this.timeline!.restart(),
      onLeave:     () => this.timeline!.reverse(),
      onEnterBack: () => this.timeline!.restart(),
      onLeaveBack: () => this.timeline!.reverse(),
    });

    // Force ScrollTrigger to recalculate all positions with the current
    // layout — critical after client-side navigation changes the DOM.
    ScrollTrigger.refresh();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Timeline factory — one cinematic multi-step sequence per variant
  // ─────────────────────────────────────────────────────────────────────────

  private buildTimeline(
    el: HTMLElement,
    dur: number,
    delay: number
  ): gsap.core.Timeline {
    const tl = gsap.timeline({ paused: true, delay });

    switch (this.srAnimation) {

      // ── fade-up ──────────────────────────────────────────────────────────
      // Rises up from 60px below with depth shear, lands with a subtle float.
      case 'fade-up': {
        gsap.set(el, {
          opacity: 0,
          y: 60,
          z: -80,
          rotateX: 12,
          transformPerspective: 1200,
          transformOrigin: '50% 100%',
        });
        tl.to(el, {
          opacity: 1,
          y: -6,             // slight overshoot upward
          z: 10,
          rotateX: -2,
          duration: dur * 0.65,
          ease: 'sine.out',
        })
        .to(el, {
          y: 0,
          z: 0,
          rotateX: 0,
          duration: dur * 0.35,
          ease: 'sine.inOut',
          clearProps: 'rotateX,z,transformPerspective,transformOrigin',
        });
        break;
      }

      // ── tilt-in ──────────────────────────────────────────────────────────
      // A cinema-quality "page unfolding from the top" with depth bloom.
      case 'tilt-in': {
        gsap.set(el, {
          opacity: 0,
          rotateX: 55,
          y: 80,
          z: -120,
          transformPerspective: 1400,
          transformOrigin: '50% 0%',
        });
        tl.to(el, {
          opacity: 1,
          rotateX: -5,
          y: -8,
          z: 20,
          duration: dur * 0.6,
          ease: 'sine.out',
        })
        .to(el, {
          rotateX: 0,
          y: 0,
          z: 0,
          duration: dur * 0.4,
          ease: 'sine.inOut',
          clearProps: 'transformPerspective,transformOrigin',
        });
        break;
      }

      // ── flip-up ──────────────────────────────────────────────────────────
      // Section headers fold in like a hard-cover book opening.
      case 'flip-up': {
        gsap.set(el, {
          opacity: 0,
          rotateX: 70,
          scaleY: 0.75,
          y: 40,
          z: -60,
          transformPerspective: 900,
          transformOrigin: 'top center',
        });
        tl.to(el, {
          opacity: 1,
          rotateX: -8,
          scaleY: 1.03,
          y: -6,
          z: 10,
          duration: dur * 0.55,
          ease: 'sine.out',
        })
        .to(el, {
          rotateX: 0,
          scaleY: 1,
          y: 0,
          z: 0,
          duration: dur * 0.45,
          ease: 'sine.inOut',
          clearProps: 'transformPerspective,transformOrigin',
        });
        break;
      }

      // ── zoom-drift ───────────────────────────────────────────────────────
      // Cards emerge slowly from space — deliberate, editorial luxury pace.
      case 'zoom-drift': {
        gsap.set(el, {
          opacity: 0,
          scale: 0.82,      // shallower start — less distance = controlled at slow speed
          y: 36,
          z: -120,
          rotateX: 10,
          rotateY: 4,
          transformPerspective: 1400,
        });
        tl.to(el, {
          opacity: 1,
          scale: 1.02,
          y: -5,
          z: 20,
          rotateX: -2,
          rotateY: -0.5,
          duration: dur * 0.65,
          ease: 'power1.out',   // gentler initial acceleration than sine.out
        })
        .to(el, {
          scale: 1,
          y: 0,
          z: 0,
          rotateX: 0,
          rotateY: 0,
          duration: dur * 0.35,
          ease: 'sine.inOut',
          clearProps: 'transformPerspective',
        });
        break;
      }

      // ── slide-left ───────────────────────────────────────────────────────
      // Sweeps in from the left with a deep-space Y-axis pivot.
      case 'slide-left': {
        gsap.set(el, {
          opacity: 0,
          x: -120,
          rotateY: 30,
          z: -100,
          skewX: 4,
          transformPerspective: 1200,
          transformOrigin: 'right center',
        });
        tl.to(el, {
          opacity: 1,
          x: 8,
          rotateY: -4,
          z: 10,
          skewX: -1,
          duration: dur * 0.6,
          ease: 'sine.out',
        })
        .to(el, {
          x: 0,
          rotateY: 0,
          z: 0,
          skewX: 0,
          duration: dur * 0.4,
          ease: 'sine.inOut',
          clearProps: 'transformPerspective,transformOrigin',
        });
        break;
      }

      // ── slide-right ──────────────────────────────────────────────────────
      // Mirror of slide-left — sweeps in from the right.
      case 'slide-right': {
        gsap.set(el, {
          opacity: 0,
          x: 120,
          rotateY: -30,
          z: -100,
          skewX: -4,
          transformPerspective: 1200,
          transformOrigin: 'left center',
        });
        tl.to(el, {
          opacity: 1,
          x: -8,
          rotateY: 4,
          z: 10,
          skewX: 1,
          duration: dur * 0.6,
          ease: 'sine.out',
        })
        .to(el, {
          x: 0,
          rotateY: 0,
          z: 0,
          skewX: 0,
          duration: dur * 0.4,
          ease: 'sine.inOut',
          clearProps: 'transformPerspective,transformOrigin',
        });
        break;
      }

      default: {
        gsap.set(el, { opacity: 0, y: 40 });
        tl.to(el, { opacity: 1, y: 0, duration: dur, ease: 'sine.out' });
      }
    }

    return tl;
  }
}
