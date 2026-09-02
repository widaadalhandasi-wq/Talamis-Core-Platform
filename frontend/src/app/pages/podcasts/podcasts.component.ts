import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { AudioContentService } from '@app/core/services/audio-content.service';
import { AudioContent } from '@app/core/models/audio-content.model';

@Component({
  selector: 'app-podcasts',
  standalone: true,
  templateUrl: './podcasts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PodcastsComponent implements OnInit {
  private readonly audioContent = inject(AudioContentService);

  // Real data pulled from the backend, ready to replace the single mocked
  // episode card in the template with a real @for loop.
  protected readonly episodes = signal<AudioContent[]>([]);

  ngOnInit(): void {
    this.audioContent.getAll().subscribe({
      next: (items) => this.episodes.set(items),
      error: (err) => console.error('Failed to load audio content', err),
    });
  }
}
