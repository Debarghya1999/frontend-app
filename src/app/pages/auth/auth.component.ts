import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import gsap from 'gsap';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnInit, AfterViewInit, OnDestroy {
  // ── State ──────────────────────────────────────────────
  isLoginMode   = true;
  isLoading     = false;
  showPassword  = false;
  authForm!: FormGroup;

  // ── ViewChild refs for GSAP targeting ─────────────────
  @ViewChild('authCard')     authCard!:     ElementRef<HTMLDivElement>;
  @ViewChild('visualPanel')  visualPanel!:  ElementRef<HTMLDivElement>;
  @ViewChild('visualImage')  visualImage!:  ElementRef<HTMLDivElement>;
  @ViewChild('visualContent')visualContent!:ElementRef<HTMLDivElement>;
  @ViewChild('brandMark')    brandMark!:    ElementRef<HTMLDivElement>;
  @ViewChild('eyebrow')      eyebrow!:      ElementRef<HTMLParagraphElement>;
  @ViewChild('headline')     headline!:     ElementRef<HTMLHeadingElement>;
  @ViewChild('coverBody')    coverBody!:    ElementRef<HTMLParagraphElement>;
  @ViewChild('trustSignals') trustSignals!: ElementRef<HTMLDivElement>;
  @ViewChild('progressBar')  progressBar!:  ElementRef<HTMLDivElement>;
  @ViewChild('modeSwitcher') modeSwitcher!: ElementRef<HTMLDivElement>;
  @ViewChild('modeSlider')   modeSlider!:   ElementRef<HTMLDivElement>;
  @ViewChild('formHeader')   formHeader!:   ElementRef<HTMLDivElement>;
  @ViewChild('divider')      divider!:      ElementRef<HTMLDivElement>;
  @ViewChild('socialRow')    socialRow!:    ElementRef<HTMLDivElement>;
  @ViewChild('formFooter')   formFooter!:   ElementRef<HTMLParagraphElement>;
  @ViewChild('submitBtn')    submitBtn!:    ElementRef<HTMLButtonElement>;
  @ViewChild('formEl')       formEl!:       ElementRef<HTMLFormElement>;
  @ViewChild('emailField')   emailField!:   ElementRef<HTMLDivElement>;
  @ViewChild('passwordField')passwordField!:ElementRef<HTMLDivElement>;
  @ViewChild('nameField')    nameField!:    ElementRef<HTMLDivElement>;

  /** Builds visible field-group elements for GSAP stagger */
  private get _fieldEls(): HTMLElement[] {
    const els: (HTMLElement | undefined)[] = [
      // Name field only included when in signup mode (CSS controls collapse)
      ...(this.isLoginMode ? [] : [this.nameField?.nativeElement]),
      this.emailField?.nativeElement,
      this.passwordField?.nativeElement,
    ];
    return els.filter(Boolean) as HTMLElement[];
  }

  // ── Services ───────────────────────────────────────────
  private fb     = inject(FormBuilder);
  private router = inject(Router);
  private cdr    = inject(ChangeDetectorRef);

  // GSAP timeline ref for cleanup
  private entranceTl!: gsap.core.Timeline;

  // ──────────────────────────────────────────────────────

  ngOnInit(): void {
    this._buildForm();
  }

  ngAfterViewInit(): void {
    // Small rAF to let Angular render DOM before GSAP reads it
    requestAnimationFrame(() => {
      this._runEntranceAnimation();
      this._positionModeSlider();
    });
  }

  ngOnDestroy(): void {
    this.entranceTl?.kill();
  }

  // ── Form construction ──────────────────────────────────

  private _buildForm(): void {
    // name control always present in DOM; validator toggled on mode-switch
    this.authForm = this.fb.group({
      name:     ['', []],                                    // no validator in login mode
      email:    ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  // ── GSAP Entrance Orchestra ────────────────────────────

  private _runEntranceAnimation(): void {
    const card = this.authCard?.nativeElement;
    if (!card) return;

    this.entranceTl = gsap.timeline({
      defaults: { ease: 'power3.out' },
    });

    // 1. Card reveal — spring-scale from slightly below + scale
    this.entranceTl.to(card, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.85,
      ease: 'expo.out',
    });

    // 2. Visual image de-zoom + de-saturate (parallax reveal)
    if (this.visualImage?.nativeElement) {
      const img = this.visualImage.nativeElement.querySelector('.visual-img');
      if (img) {
        this.entranceTl.to(img, {
          scale: 1,
          filter: 'saturate(1)',
          duration: 1.4,
          ease: 'power2.out',
        }, '<0.1');
      }
    }

    // 3. Progress bar swipe
    if (this.progressBar?.nativeElement) {
      this.entranceTl.to(this.progressBar.nativeElement, {
        width: '65%',
        duration: 1.8,
        ease: 'expo.inOut',
      }, '<0.2');
    }

    // 4. Visual content stagger — brand → eyebrow → headline → body → signals
    const leftItems = [
      this.brandMark?.nativeElement,
      this.eyebrow?.nativeElement,
      this.headline?.nativeElement,
      this.coverBody?.nativeElement,
      this.trustSignals?.nativeElement,
    ].filter(Boolean);

    if (leftItems.length) {
      this.entranceTl.fromTo(leftItems,
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.65,
          ease: 'power3.out',
        }, '<0.25');
    }

    // 5. Right panel: mode switcher, header, fields, submit, divider, social, footer
    const rightSequence = [
      this.modeSwitcher?.nativeElement,
      this.formHeader?.nativeElement,
    ].filter(Boolean);

    if (rightSequence.length) {
      this.entranceTl.fromTo(rightSequence,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.55,
          ease: 'power3.out',
        }, '<0.15');
    }

    // 6. Form fields stagger
    const fields = this._fieldEls;
    if (fields.length) {
      this.entranceTl.fromTo(fields,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'power2.out' },
        '<0.06');
    }

    // 7. Submit button with spring pop
    if (this.submitBtn?.nativeElement) {
      this.entranceTl.fromTo(this.submitBtn.nativeElement,
        { scale: 0.92, opacity: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'back.out(1.8)',
        }, '<0.05');
    }

    // 8. Remaining items
    const tail = [
      this.divider?.nativeElement,
      this.socialRow?.nativeElement,
      this.formFooter?.nativeElement,
    ].filter(Boolean);

    if (tail.length) {
      this.entranceTl.to(tail, {
        opacity: 1,
        stagger: 0.07,
        duration: 0.4,
        ease: 'power2.out',
      }, '<0.04');
    }
  }

  // ── Mode slider positioning ────────────────────────────

  private _positionModeSlider(): void {
    const switcher = this.modeSwitcher?.nativeElement;
    const slider   = this.modeSlider?.nativeElement;
    if (!switcher || !slider) return;

    const updateSlider = (activeIndex: 0 | 1) => {
      const pills = switcher.querySelectorAll<HTMLElement>('.mode-pill');
      if (!pills[activeIndex]) return;

      const pill   = pills[activeIndex];
      const sRect  = switcher.getBoundingClientRect();
      const pRect  = pill.getBoundingClientRect();

      gsap.to(slider, {
        left: pRect.left - sRect.left,
        width: pRect.width,
        duration: 0.4,
        ease: 'expo.out',
      });
    };

    // Initial placement
    updateSlider(this.isLoginMode ? 0 : 1);

    // Expose updater to be called on mode toggle
    (this as any)._updateSlider = updateSlider;
  }

  // ── Mode switching ─────────────────────────────────────

  switchToLogin(): void {
    if (this.isLoginMode) return;
    this._animateModeSwitch(true);
  }

  switchToSignup(): void {
    if (!this.isLoginMode) return;
    this._animateModeSwitch(false);
  }

  toggleMode(): void {
    this._animateModeSwitch(!this.isLoginMode);
  }

  private _animateModeSwitch(toLogin: boolean): void {
    const formEl = this.formEl?.nativeElement;
    if (!formEl) {
      this._applyModeChange(toLogin);
      return;
    }

    // Exit animation
    gsap.to(formEl, {
      opacity: 0,
      y: toLogin ? -10 : 10,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        this._applyModeChange(toLogin);
        // Entrance
        gsap.fromTo(formEl,
          { opacity: 0, y: toLogin ? 12 : -12 },
          { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }
        );
        // Re-stagger fields (after Angular re-renders new controls)
        setTimeout(() => {
          const fields = this._fieldEls;
          gsap.fromTo(fields,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, stagger: 0.07, duration: 0.3, ease: 'power2.out' }
          );
        }, 60);
      },
    });

    // Slide slider
    const updateSlider: ((i: 0|1) => void) | undefined = (this as any)._updateSlider;
    updateSlider?.(toLogin ? 0 : 1);

    // Header crossfade
    const header = this.formHeader?.nativeElement;
    if (header) {
      gsap.to(header, {
        opacity: 0, y: -6, duration: 0.18, ease: 'power2.in',
        onComplete: () => {
          this.cdr.markForCheck();
          gsap.to(header, { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out', delay: 0.22 });
        },
      });
    }
  }

  private _applyModeChange(toLogin: boolean): void {
    this.isLoginMode = toLogin;
    // Toggle name validator without rebuilding the form (prevents height jump)
    const nameCtrl = this.authForm.get('name');
    if (nameCtrl) {
      if (toLogin) {
        nameCtrl.clearValidators();
        nameCtrl.setValue('');
      } else {
        nameCtrl.setValidators([Validators.required]);
      }
      nameCtrl.updateValueAndValidity({ emitEvent: false });
    }
    this.authForm.markAsPristine();
    this.authForm.markAsUntouched();
    this.cdr.markForCheck();
  }

  // ── Toggle password visibility ─────────────────────────

  togglePassword(): void {
    this.showPassword = !this.showPassword;
    this.cdr.markForCheck();
  }

  // ── Form submission ────────────────────────────────────

  onSubmit(): void {
    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      this.cdr.markForCheck();
      this._shakeForm();
      return;
    }

    this.isLoading = true;
    this.cdr.markForCheck();

    // Simulate async auth
    setTimeout(() => {
      this.isLoading = false;
      this.cdr.markForCheck();
      this.router.navigate(['/landing']);
    }, 1200);
  }

  /** Elastic shake on failed submit — Framer Motion spring feel */
  private _shakeForm(): void {
    const formEl = this.formEl?.nativeElement;
    if (!formEl) return;

    // Keyframe-based shake — physically convincing spring oscillation
    gsap.timeline()
      .to(formEl, { x: -7,  duration: 0.06, ease: 'power2.in' })
      .to(formEl, { x:  7,  duration: 0.07, ease: 'power2.inOut' })
      .to(formEl, { x: -5,  duration: 0.07, ease: 'power2.inOut' })
      .to(formEl, { x:  5,  duration: 0.07, ease: 'power2.inOut' })
      .to(formEl, { x: -3,  duration: 0.06, ease: 'power2.inOut' })
      .to(formEl, { x:  3,  duration: 0.06, ease: 'power2.inOut' })
      .to(formEl, { x:  0,  duration: 0.08, ease: 'elastic.out(1, 0.5)' });

    // Flash empty fields red to draw attention to errors
    const invalidFields = this._fieldEls.filter(el => {
      const input = el.querySelector('input');
      return input && (input as HTMLInputElement).value === '';
    });

    if (invalidFields.length) {
      gsap.fromTo(
        invalidFields.map(f => f.querySelector('.field-line')),
        { backgroundColor: 'rgba(139,0,0,0.0)' },
        {
          backgroundColor: 'rgba(139,0,0,0.4)',
          duration: 0.18,
          yoyo: true,
          repeat: 3,
          ease: 'power2.inOut',
        }
      );
    }
  }
}
