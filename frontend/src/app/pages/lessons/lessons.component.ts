import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { UserSubmissionService } from '@app/core/services/user-submission.service';
import { UserSubmission } from '@app/core/models/user-submission.model';

@Component({
  selector: 'app-lessons',
  standalone: true,
  templateUrl: './lessons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonsComponent implements OnInit {
  private readonly userSubmissions = inject(UserSubmissionService);

  // Real data pulled from the backend, ready to drive the progress/streak
  // sections once the mocked numbers in the template are swapped for
  // bindings (e.g. mySubmissions().length).
  protected readonly mySubmissions = signal<UserSubmission[]>([]);

  ngOnInit(): void {
    this.userSubmissions.getMine().subscribe({
      next: (submissions) => this.mySubmissions.set(submissions),
      error: (err) => console.error('Failed to load submissions', err),
    });
  }
}
