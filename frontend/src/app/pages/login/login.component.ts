import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly mode = signal<'login' | 'register'>('login');
  protected readonly fullName = signal('');
  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected toggleMode(): void {
    this.mode.update((m) => (m === 'login' ? 'register' : 'login'));
    this.errorMessage.set(null);
  }

  protected submit(): void {
    this.errorMessage.set(null);
    this.isSubmitting.set(true);

    const request$ =
      this.mode() === 'login'
        ? this.auth.login({ email: this.email(), password: this.password() })
        : this.auth.register({
            fullName: this.fullName(),
            email: this.email(),
            password: this.password(),
          });

    request$.subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.isSubmitting.set(false);
        const backendErrors = err?.error?.errors as string[] | undefined;
        this.errorMessage.set(
          backendErrors?.join(' ') ?? 'Something went wrong. Please try again.',
        );
      },
    });
  }
}
