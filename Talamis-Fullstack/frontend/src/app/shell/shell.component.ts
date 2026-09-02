import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DashboardComponent } from '@app/pages/dashboard/dashboard.component';
import { LessonsComponent } from '@app/pages/lessons/lessons.component';
import { PodcastsComponent } from '@app/pages/podcasts/podcasts.component';
import { AuthService } from '@app/core/services/auth.service';
import { Router } from '@angular/router';

type Tab = 'dashboard' | 'lessons' | 'podcasts';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [DashboardComponent, LessonsComponent, PodcastsComponent],
  templateUrl: './shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  // Same three-tab, client-side switch as the original React useState<Tab> —
  // deliberately kept as a signal instead of Angular Router routes, since the
  // source design has no per-tab URLs.
  protected readonly activeTab = signal<Tab>('dashboard');

  protected readonly tabs: { id: Tab; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'lessons', label: 'Lessons' },
    { id: 'podcasts', label: 'Podcasts' },
  ];

  protected setTab(tab: Tab): void {
    this.activeTab.set(tab);
  }

  protected logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
