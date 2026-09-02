import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { AuthService } from '@app/core/services/auth.service';
import { DailyPromptService } from '@app/core/services/daily-prompt.service';
import { DailyPrompt } from '@app/core/models/daily-prompt.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly dailyPrompts = inject(DailyPromptService);

  // Drives the "Good morning, {{ firstName() }}!" greeting in the template —
  // falls back gracefully if the user record has no name yet.
  protected readonly firstName = computed(() => {
    const fullName = this.auth.currentUser()?.fullName;
    return fullName?.split(' ')[0] ?? 'there';
  });

  // Real data pulled from the backend. Not yet rendered in the markup below —
  // the converted template is still the static Figma mockup for the card
  // content. Loop over `upcomingPrompts()` here (e.g. with @for) once you're
  // ready to replace the mocked prompt card(s) with live data.
  protected readonly upcomingPrompts = signal<DailyPrompt[]>([]);

  ngOnInit(): void {
    this.dailyPrompts.getUpcoming(7).subscribe({
      next: (prompts) => this.upcomingPrompts.set(prompts),
      error: (err) => console.error('Failed to load upcoming prompts', err),
    });
  }
}
