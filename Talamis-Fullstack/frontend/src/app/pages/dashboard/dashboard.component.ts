import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { DailyPromptService } from '@app/core/services/daily-prompt.service';
import { DailyPrompt } from '@app/core/models/daily-prompt.model';

export interface PromptFeedback {
  score: number;
  fluency: string;
  feedbackText: string;
  tip: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly auth = inject(AuthService);
  private readonly dailyPrompts = inject(DailyPromptService);
  private readonly router = inject(Router);

  // حالة النوافذ المنبثقة
  protected readonly isMenuOpen = signal<boolean>(false);
  protected readonly isLessonModalOpen = signal<boolean>(false);
  protected readonly isGoalModalOpen = signal<boolean>(false);

  // تفاصيل المستخدم
  protected readonly firstName = computed(() => {
    const fullName = this.auth.currentUser()?.fullName;
    return fullName ? fullName.split(' ')[0] : 'there';
  });

  // حالة الدرس التفاعلي في بطاقة الداشبورد
  protected readonly lessonProgress = signal<number>(60);
  protected readonly selectedQuizOption = signal<number | null>(null);
  protected readonly quizSubmitted = signal<boolean>(false);
  protected readonly isQuizCorrect = signal<boolean>(false);

  // حالة مشغل الصوت الحقيقي
  protected readonly isPlayingAudio = signal<boolean>(false);
  protected readonly audioCurrentTime = signal<number>(45);
  protected readonly audioTotalDuration = 180;
  private audioTimer: any = null;

  // حالة نقاط الـ XP والهدف اليومي
  protected readonly earnedXp = signal<number>(50);
  protected readonly dailyGoalPercentage = signal<number>(80);
  protected readonly streakDays = signal<number>(7);

  // قائمة الأسئلة اليومية للـ 7 أيام
  protected readonly upcomingPrompts = signal<DailyPrompt[]>([]);
  protected readonly completedPromptIds = signal<Set<string>>(new Set());

  // حالة تدريب السؤال اليومي (Practice Modal)
  protected readonly activePracticePrompt = signal<DailyPrompt | null>(null);
  protected readonly userPracticeText = signal<string>('');
  protected readonly isRecording = signal<boolean>(false);
  protected readonly recordingSeconds = signal<number>(0);
  protected recordingTimerInterval: any = null;
  protected readonly isSubmitting = signal<boolean>(false);
  protected readonly aiFeedback = signal<PromptFeedback | null>(null);

  ngOnInit(): void {
    const full7DayPrompts: DailyPrompt[] = [
      {
        promptId: 'prompt_1',
        title: 'Day 1 • Morning Routine',
        questionText: 'How does your ideal morning start when you do not have work or classes?',
        targetDate: new Date().toISOString(),
        difficultyLevel: 'Intermediate',
        modelAudioUrl: null,
      },
      {
        promptId: 'prompt_2',
        title: 'Day 2 • Travel & Adventure',
        questionText: 'Describe a city or natural landscape around the world you would love to explore.',
        targetDate: new Date(Date.now() + 86400000).toISOString(),
        difficultyLevel: 'Beginner',
        modelAudioUrl: null,
      },
      {
        promptId: 'prompt_3',
        title: 'Day 3 • Food & Local Culture',
        questionText: 'If an international friend visits your country, what traditional meal must they try?',
        targetDate: new Date(Date.now() + 172800000).toISOString(),
        difficultyLevel: 'Intermediate',
        modelAudioUrl: null,
      },
      {
        promptId: 'prompt_4',
        title: 'Day 4 • Future Goals & Career',
        questionText: 'What is an ambitious skill or milestone you want to achieve this year?',
        targetDate: new Date(Date.now() + 259200000).toISOString(),
        difficultyLevel: 'Advanced',
        modelAudioUrl: null,
      },
      {
        promptId: 'prompt_5',
        title: 'Day 5 • Favorite Book or Movie',
        questionText: 'Talk about a movie or book that inspired you and explain why it left an impact on you.',
        targetDate: new Date(Date.now() + 345600000).toISOString(),
        difficultyLevel: 'Beginner',
        modelAudioUrl: null,
      },
      {
        promptId: 'prompt_6',
        title: 'Day 6 • Technology & Innovation',
        questionText: 'How has modern technology or artificial intelligence changed the way you learn languages?',
        targetDate: new Date(Date.now() + 432000000).toISOString(),
        difficultyLevel: 'Advanced',
        modelAudioUrl: null,
      },
      {
        promptId: 'prompt_7',
        title: 'Day 7 • Weekend Reflection',
        questionText: 'What is the most interesting thing you learned or experienced throughout this past week?',
        targetDate: new Date(Date.now() + 518400000).toISOString(),
        difficultyLevel: 'Intermediate',
        modelAudioUrl: null,
      },
    ];

    this.upcomingPrompts.set(full7DayPrompts);

    this.dailyPrompts.getUpcoming(7).subscribe({
      next: (apiPrompts) => {
        if (apiPrompts && apiPrompts.length > 0) {
          const merged = [...apiPrompts];
          for (let i = apiPrompts.length; i < 7; i++) {
            merged.push(full7DayPrompts[i]);
          }
          this.upcomingPrompts.set(merged);
        }
      },
      error: () => console.log('Using 7-day English dataset'),
    });
  }

  ngOnDestroy(): void {
    this.stopAudioPlayback();
    this.stopRecordingTimer();
  }

  // ================= 1. بطاقة الدرس التفاعلي داخل الداشبورد =================
  protected openLesson(): void {
    this.isLessonModalOpen.set(true);
    this.selectedQuizOption.set(null);
    this.quizSubmitted.set(false);
  }

  protected closeLesson(): void {
    this.isLessonModalOpen.set(false);
  }

  protected selectQuizOption(index: number): void {
    if (!this.quizSubmitted()) {
      this.selectedQuizOption.set(index);
    }
  }

  protected submitQuiz(): void {
    if (this.selectedQuizOption() === null) return;
    this.quizSubmitted.set(true);
    const correct = this.selectedQuizOption() === 1;
    this.isQuizCorrect.set(correct);

    if (correct) {
      this.lessonProgress.set(100);
      this.earnedXp.update((xp) => xp + 30);
      this.dailyGoalPercentage.set(100);
    }
  }

  // ================= 2. بطاقة مشغل الصوت التفاعلي =================
  protected togglePlayAudio(): void {
    if (this.isPlayingAudio()) {
      this.stopAudioPlayback();
    } else {
      this.startAudioPlayback();
    }
  }

  private startAudioPlayback(): void {
    this.isPlayingAudio.set(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        'Welcome to Silicon Valley Stories. Today we explore how modern founders build innovative software and communicate globally.'
      );
      utterance.lang = 'en-US';
      utterance.rate = 0.95;
      utterance.onend = () => this.stopAudioPlayback();
      window.speechSynthesis.speak(utterance);
    }

    this.audioTimer = setInterval(() => {
      this.audioCurrentTime.update((t) => {
        if (t >= this.audioTotalDuration) {
          this.stopAudioPlayback();
          return 0;
        }
        return t + 1;
      });
    }, 1000);
  }

  private stopAudioPlayback(): void {
    this.isPlayingAudio.set(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (this.audioTimer) {
      clearInterval(this.audioTimer);
      this.audioTimer = null;
    }
  }

  protected seekAudio(seconds: number): void {
    this.audioCurrentTime.update((t) => Math.max(0, Math.min(this.audioTotalDuration, t + seconds)));
  }

  protected formatAudioTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // ================= 3. بطاقة الهدف اليومي =================
  protected openGoalModal(): void {
    this.isGoalModalOpen.set(true);
  }

  protected closeGoalModal(): void {
    this.isGoalModalOpen.set(false);
  }

  // ================= 4. بطاقات الـ Prompts =================
  protected openPractice(prompt: DailyPrompt): void {
    this.activePracticePrompt.set(prompt);
    this.userPracticeText.set('');
    this.aiFeedback.set(null);
    this.isRecording.set(false);
    this.recordingSeconds.set(0);
  }

  protected closePractice(): void {
    this.stopRecordingTimer();
    this.activePracticePrompt.set(null);
    this.aiFeedback.set(null);
  }

  protected toggleVoiceRecording(): void {
    if (this.isRecording()) {
      this.stopRecordingTimer();
      this.isRecording.set(false);
      if (!this.userPracticeText()) {
        this.userPracticeText.set(
          'I usually start my morning with a warm cup of coffee, followed by 20 minutes of reading.'
        );
      }
    } else {
      this.isRecording.set(true);
      this.recordingSeconds.set(0);
      this.recordingTimerInterval = setInterval(() => {
        this.recordingSeconds.update((s) => s + 1);
      }, 1000);
    }
  }

  private stopRecordingTimer(): void {
    if (this.recordingTimerInterval) {
      clearInterval(this.recordingTimerInterval);
      this.recordingTimerInterval = null;
    }
  }

  protected speakQuestion(text: string): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }

  protected submitPractice(): void {
    if (!this.userPracticeText().trim() && !this.recordingSeconds()) return;
    this.isSubmitting.set(true);

    setTimeout(() => {
      this.isSubmitting.set(false);
      this.aiFeedback.set({
        score: 94,
        fluency: 'High Fluency & Natural Pronunciation',
        feedbackText: 'Excellent structure! Your vocabulary is rich and the grammar is precise.',
        tip: 'Try combining shorter sentences using connectors like "furthermore" or "meanwhile".',
      });

      const currentPrompt = this.activePracticePrompt();
      if (currentPrompt) {
        this.completedPromptIds.update((set) => {
          const next = new Set(set);
          next.add(currentPrompt.promptId);
          return next;
        });
        this.earnedXp.update((xp) => xp + 20);
        this.dailyGoalPercentage.set(100);
      }
    }, 900);
  }

  protected isPromptCompleted(promptId: string): boolean {
    return this.completedPromptIds().has(promptId);
  }

  protected toggleMenu(): void {
    this.isMenuOpen.update((v) => !v);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  protected logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}