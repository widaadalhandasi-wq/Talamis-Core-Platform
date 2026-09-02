import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  // حقن الخدمات باستخدام inject()
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  // حالة المكون باستخدام Angular Signals
  protected readonly mode = signal<'login' | 'register'>('login');
  protected readonly fullName = signal<string>('');
  protected readonly email = signal<string>('');
  protected readonly password = signal<string>('');
  protected readonly isSubmitting = signal<boolean>(false);
  protected readonly errorMessage = signal<string | null>(null);

  /**
   * التبديل بين وضع تسجيل الدخول (login) وإنشاء حساب (register)
   */
  protected toggleMode(): void {
    this.mode.update((currentMode) => (currentMode === 'login' ? 'register' : 'login'));
    this.errorMessage.set(null);
  }

  /**
   * إرسال النموذج ومعالجة الطلب
   */
  protected submit(): void {
    // 1. التحقق البسيط من المدخلات
    const emailVal = this.email().trim();
    const passwordVal = this.password().trim();
    const fullNameVal = this.fullName().trim();

    if (!emailVal || !passwordVal || (this.mode() === 'register' && !fullNameVal)) {
      this.errorMessage.set('Please fill in all required fields.');
      return;
    }

    this.errorMessage.set(null);
    this.isSubmitting.set(true);

    // 2. تجهيز الطلب حسب الوضع
    const request$ =
      this.mode() === 'login'
        ? this.auth.login({
            email: emailVal,
            password: passwordVal,
          })
        : this.auth.register({
            fullName: fullNameVal,
            email: emailVal,
            password: passwordVal,
          });

    // 3. تنفيذ الـ Subscription مع منع تسريب الذاكرة (Memory Leak)
    request$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          this.isSubmitting.set(false);
          
          // استخراج رسائل الخطأ من الـ Backend
          const backendErrors = err?.error?.errors as string[] | undefined;
          const directMessage = err?.error?.message as string | undefined;

          if (backendErrors && backendErrors.length > 0) {
            this.errorMessage.set(backendErrors.join(' '));
          } else if (directMessage) {
            this.errorMessage.set(directMessage);
          } else if (err.status === 401 || err.status === 400) {
            this.errorMessage.set('Invalid email or password. Please check your credentials.');
          } else {
            this.errorMessage.set('Connection error. Please try again later.');
          }
        },
      });
  }
}