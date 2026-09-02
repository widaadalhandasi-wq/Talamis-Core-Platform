import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSubmissionService } from '@app/core/services/user-submission.service';
import { UserSubmission } from '@app/core/models/user-submission.model';

export interface LessonModule {
  id: string;
  title: string;
  category: string;
  level: string;
  description: string;
  lessonsCount: number;
  duration: string;
  progress: number;
  status: 'completed' | 'in_progress' | 'locked';
  phrase: string;
  quizQuestion: string;
  quizOptions: string[];
  correctIdx: number;
}

@Component({
  selector: 'app-lessons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lessons.component.html',
  styleUrl: './lessons.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonsComponent implements OnInit {
  private readonly userSubmissions = inject(UserSubmissionService);
  protected readonly mySubmissions = signal<UserSubmission[]>([]);

  protected readonly activeFilter = signal<'all' | 'in_progress' | 'completed' | 'locked'>('all');

  protected readonly allModules = signal<LessonModule[]>([
    {
      id: 'mod_1',
      title: 'Business & Travel English',
      category: 'Airport & Transit',
      level: 'Intermediate English',
      description: 'Mastering airport check-ins, flight connections, customs questions, and baggage claim essentials.',
      lessonsCount: 10,
      duration: '15 mins',
      progress: 60,
      status: 'in_progress',
      phrase: 'Where can I collect my checked luggage for flight BA 178?',
      quizQuestion: 'Choose the most polite request for changing seats:',
      quizOptions: [
        'A) Change my seat now.',
        'B) Could I please request a window seat if available?',
        'C) I want another seat immediately.',
      ],
      correctIdx: 1,
    },
    {
      id: 'mod_2',
      title: 'Everyday Conversations & Idioms',
      category: 'Social English',
      level: 'Upper Beginner',
      description: 'Natural small talk, expressing opinions, agreeing and disagreeing, and common everyday idioms.',
      lessonsCount: 12,
      duration: '18 mins',
      progress: 85,
      status: 'in_progress',
      phrase: 'Let us wrap up today\'s discussion and catch up tomorrow.',
      quizQuestion: 'What does "wrap up" mean?',
      quizOptions: [
        'A) To wrap a gift',
        'B) To finish and conclude successfully',
        'C) To delay indefinitely',
      ],
      correctIdx: 1,
    },
    {
      id: 'mod_3',
      title: 'English Foundations & Essentials',
      category: 'Core Fundamentals',
      level: 'Beginner (A1)',
      description: 'Foundational grammar, introductions, numbers, times, and basic everyday conversational vocabulary.',
      lessonsCount: 12,
      duration: '20 mins',
      progress: 100,
      status: 'completed',
      phrase: 'Hello, nice to meet you! Could you please speak a little slower?',
      quizQuestion: 'Standard response to "How are you doing?":',
      quizOptions: [
        'A) I am doing great, thank you! How about yourself?',
        'B) My age is 25.',
        'C) Yes I am today.',
      ],
      correctIdx: 0,
    },
    {
      id: 'mod_4',
      title: 'Dining Out & Restaurant English',
      category: 'Food & Hospitality',
      level: 'Beginner (A2)',
      description: 'Booking tables, ordering food, asking for ingredient descriptions, and requesting the bill politely.',
      lessonsCount: 8,
      duration: '14 mins',
      progress: 40,
      status: 'in_progress',
      phrase: 'Could we please have the bill whenever you have a moment?',
      quizQuestion: 'How to ask for the check in American English?',
      quizOptions: [
        'A) Can we get the check, please?',
        'B) Money paper please.',
        'C) Give ticket now.',
      ],
      correctIdx: 0,
    },
    {
      id: 'mod_5',
      title: 'Workplace & Pitch Negotiations',
      category: 'Professional English',
      level: 'Advanced (C1)',
      description: 'Executive presentations, negotiating contracts, handling client objections, and boardroom etiquette.',
      lessonsCount: 10,
      duration: '25 mins',
      progress: 0,
      status: 'locked',
      phrase: 'Let us delve deeper into our quarterly performance benchmarks.',
      quizQuestion: 'What does "to delve into" mean?',
      quizOptions: [
        'A) To investigate or explore thoroughly',
        'B) To delete all documents',
        'C) To postpone indefinitely',
      ],
      correctIdx: 0,
    },
  ]);

  protected readonly filteredModules = computed(() => {
    const f = this.activeFilter();
    if (f === 'all') return this.allModules();
    return this.allModules().filter((m) => m.status === f);
  });

  protected readonly activeModule = signal<LessonModule | null>(null);
  protected readonly selectedQuizIdx = signal<number | null>(null);
  protected readonly quizSubmitted = signal<boolean>(false);

  ngOnInit(): void {
    this.userSubmissions.getMine().subscribe({
      next: (subs) => {
        if (subs) this.mySubmissions.set(subs);
      },
      error: (err) => console.log('Loaded module cache', err),
    });
  }

  protected setFilter(filter: 'all' | 'in_progress' | 'completed' | 'locked'): void {
    this.activeFilter.set(filter);
  }

  protected openLessonModal(mod: LessonModule): void {
    this.activeModule.set(mod);
    this.selectedQuizIdx.set(null);
    this.quizSubmitted.set(false);
  }

  protected closeLessonModal(): void {
    this.activeModule.set(null);
  }

  protected selectQuizOption(idx: number): void {
    if (!this.quizSubmitted()) {
      this.selectedQuizIdx.set(idx);
    }
  }

  protected playAudio(text: string): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = 'en-US';
      utt.rate = 0.92;
      window.speechSynthesis.speak(utt);
    }
  }

  protected submitQuiz(): void {
    if (this.selectedQuizIdx() === null) return;
    if (this.quizSubmitted()) {
      const current = this.activeModule();
      if (current) {
        this.allModules.update((items) =>
          items.map((m) =>
            m.id === current.id
              ? { ...m, progress: Math.min(100, m.progress + 20), status: m.progress + 20 >= 100 ? 'completed' : 'in_progress' }
              : m
          )
        );
      }
      this.closeLessonModal();
    } else {
      this.quizSubmitted.set(true);
    }
  }
}