import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioContentService } from '@app/core/services/audio-content.service';

export interface PodcastItem {
  id: string;
  title: string;
  series: string;
  category: string;
  level: string;
  speaker: string;
  description: string;
  durationMinutes: number;
  coverImageUrl: string;
  transcript: string[];
}

@Component({
  selector: 'app-podcasts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './podcasts.component.html',
  styleUrl: './podcasts.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PodcastsComponent implements OnInit, OnDestroy {
  private readonly audioContent = inject(AudioContentService);

  // التصنيفات المتاحة
  protected readonly categories = [
    'All Types',
    'Business',
    'Culture & Etiquette',
    'Slang & Idioms',
    'Technology & AI',
    'Daily Life & Travel',
    'Mindset & Psychology',
  ];

  protected readonly selectedCategory = signal<string>('All Types');

  // قائمة الحلقات المتنوعة الجاهزة بصوت ونصوص حقيقية
  private readonly sampleEpisodes: PodcastItem[] = [
    {
      id: 'pod-1',
      title: 'Navigating Corporate Culture & Pitching',
      series: 'Executive English Masterclass',
      category: 'Business',
      level: 'Advanced C1',
      speaker: 'Marcus Vance (Senior Executive Coach)',
      description: 'Learn the subtle linguistic nuances and phrasing required to pitch ideas in corporate meetings.',
      durationMinutes: 45,
      coverImageUrl: 'assets/podcast-cover.png',
      transcript: [
        'Welcome to Executive English Masterclass. Today we explore how to navigate corporate discussions with composure.',
        'When pitching an ambitious roadmap, avoid hesitant wording. Frame your proposition with confidence: Our strategic metrics indicate a decisive 24 percent uplift.',
        'Another essential phrase is to circle back. For instance: Let us circle back to the revenue projection during our Q3 briefing.',
        'Mastering these subtle communicative shifts establishes authority and executive presence across every global meeting.',
      ],
    },
    {
      id: 'pod-2',
      title: 'Cultural Nuances & Global Etiquette',
      series: 'Cross-Cultural Expeditions',
      category: 'Culture & Etiquette',
      level: 'Intermediate B1',
      speaker: 'Elena Rostova (Cultural Anthropologist)',
      description: 'Understanding the unspoken rules of etiquette and polite disagreement with international peers.',
      durationMinutes: 28,
      coverImageUrl: 'assets/podcast-cover.png',
      transcript: [
        'Hello and welcome to Cross-Cultural Expeditions. Today we examine the unspoken art of polite disagreement in international environments.',
        'In many workplaces, direct conflict is softened with diplomatic buffers like: I see where you are coming from, however have you considered another angle?',
        'Paying attention to tone and body language prevents misunderstandings and fosters long-term cross-border trust.',
      ],
    },
    {
      id: 'pod-3',
      title: 'Street Slang & Modern Everyday Idioms',
      series: 'The Urban Vernacular',
      category: 'Slang & Idioms',
      level: 'Beginner A2',
      speaker: 'Jake Miller (Language & Pop-Culture Host)',
      description: 'Sound like a native speaker by mastering casual idioms and popular modern street expressions.',
      durationMinutes: 15,
      coverImageUrl: 'assets/podcast-cover.png',
      transcript: [
        'Hey everyone! Welcome back to The Urban Vernacular. Today we are diving into expressions that native speakers use all day long.',
        'Ever heard someone say No worries at all, it is a piece of cake? That simply means the task is remarkably easy!',
        'Another super common phrase is to call it a day, which means deciding to stop working and relax until tomorrow morning.',
        'Try sprinkling these into your informal coffee chat with friends to sound completely natural.',
      ],
    },
    {
      id: 'pod-4',
      title: 'The AI Revolution & The Next Century',
      series: 'Future Horizons & Tech Insights',
      category: 'Technology & AI',
      level: 'Advanced C2',
      speaker: 'Dr. Sarah Lin (AI Researcher & Futurist)',
      description: 'How artificial intelligence, neural networks, and spatial computing are reshaping software engineering.',
      durationMinutes: 38,
      coverImageUrl: 'assets/podcast-cover.png',
      transcript: [
        'Welcome to Future Horizons. Today we analyze how generative intelligence and multimodal models are transforming software engineering.',
        'We are witnessing a monumental transition from deterministic code to autonomous reasoning workflows and dynamic interfaces.',
        'Specialized technical terminology like latent space, few-shot reasoning, and distributed consensus empowers developers worldwide.',
      ],
    },
    {
      id: 'pod-5',
      title: 'Coffeehouse Dialogues & Travel Survival',
      series: 'Wanderlust Audio Diaries',
      category: 'Daily Life & Travel',
      level: 'Beginner A2',
      speaker: 'Liam O’Connor (Travel Journalist)',
      description: 'Practical conversational English for ordering coffee, asking for directions, and making travel friends.',
      durationMinutes: 22,
      coverImageUrl: 'assets/podcast-cover.png',
      transcript: [
        'Welcome back wanderers! Imagine stepping off the morning train into a bustling café in central London.',
        'A natural way to order is: Could I please get an oat flat white and a warm croissant to go?',
        'If you need directions to the nearest station, simply ask: Excuse me, which platform leads towards Kings Cross?',
      ],
    },
    {
      id: 'pod-6',
      title: 'Peak Focus & The Neuroscience of Habit',
      series: 'Mindset & Psychology Lab',
      category: 'Mindset & Psychology',
      level: 'Intermediate B2',
      speaker: 'Dr. Aris Thorne (Cognitive Neuroscientist)',
      description: 'Unlocking deep focus, overcoming mental fatigue, and building unstoppable language learning routines.',
      durationMinutes: 32,
      coverImageUrl: 'assets/podcast-cover.png',
      transcript: [
        'Welcome to Mindset & Psychology Lab. Today we break down the neural mechanisms that enable effortless deep work.',
        'Neuroplasticity reveals that practicing a language in twenty-minute daily intervals produces substantially higher retention than marathon sessions.',
        'By pairing your morning routine with ten minutes of active listening, you cement automatic habit loops in your prefrontal cortex.',
      ],
    },
  ];

  protected readonly allEpisodes = signal<PodcastItem[]>(this.sampleEpisodes);
  protected readonly activeEpisode = signal<PodcastItem>(this.sampleEpisodes[0]);

  // حالة المشغل
  protected readonly isPlaying = signal<boolean>(false);
  protected readonly currentSentenceIndex = signal<number>(0);
  protected readonly playbackSpeed = signal<number>(1.0);
  protected readonly currentTimeSec = signal<number>(0);
  protected readonly showTranscript = signal<boolean>(true);

  private timer: any = null;

  protected readonly filteredEpisodes = computed(() => {
    const cat = this.selectedCategory();
    if (cat === 'All Types') return this.allEpisodes();
    return this.allEpisodes().filter((e) => e.category === cat);
  });

  protected readonly upNextEpisodes = computed(() => {
    const active = this.activeEpisode();
    return this.filteredEpisodes().filter((e) => e.id !== active?.id);
  });

  ngOnInit(): void {
    this.audioContent.getAll().subscribe({
      next: (items: any[]) => {
        if (items && items.length > 0) {
          const apiMapped: PodcastItem[] = items.map((it, idx) => ({
            id: it.audioId || it.id || `api_${idx}`,
            title: it.title || 'English Audio Chapter',
            series: it.series || it.genre || 'Talamis Series',
            category: it.category || 'Business',
            level: it.level || it.difficultyLevel || 'Intermediate B2',
            speaker: it.speaker || 'Language Specialist',
            description: it.description || it.transcript || it.summary || 'Audio listening practice.',
            durationMinutes: it.durationMinutes || 30,
            coverImageUrl: it.coverImageUrl || 'assets/podcast-cover.png',
            transcript: it.transcript ? [it.transcript] : this.sampleEpisodes[0].transcript,
          }));
          this.allEpisodes.set([...this.sampleEpisodes, ...apiMapped]);
        }
      },
      error: () => console.log('Ready with rich podcast catalogue.'),
    });
  }

  ngOnDestroy(): void {
    this.stopAudioCompletely();
  }

  protected setCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  protected togglePlay(episode?: PodcastItem): void {
    if (episode && episode.id !== this.activeEpisode().id) {
      this.stopAudioCompletely();
      this.activeEpisode.set(episode);
      this.currentSentenceIndex.set(0);
      this.currentTimeSec.set(0);
      this.isPlaying.set(true);
      this.startTimer();
      this.speakCurrentSentence();
      return;
    }

    if (this.isPlaying()) {
      this.pauseAudio();
    } else {
      this.isPlaying.set(true);
      this.startTimer();
      this.speakCurrentSentence();
    }
  }

  protected stopAudioCompletely(): void {
    this.isPlaying.set(false);
    this.stopTimer();
    this.currentSentenceIndex.set(0);
    this.currentTimeSec.set(0);
    this.cancelSpeech();
  }

  protected pauseAudio(): void {
    this.isPlaying.set(false);
    this.stopTimer();
    this.cancelSpeech();
  }

  protected playSentence(index: number): void {
    this.currentSentenceIndex.set(index);
    if (!this.isPlaying()) {
      this.isPlaying.set(true);
      this.startTimer();
    }
    this.speakCurrentSentence();
  }

  protected setSpeed(speed: number): void {
    this.playbackSpeed.set(speed);
    if (this.isPlaying()) {
      this.speakCurrentSentence();
    }
  }

  protected seek(secondsDelta: number): void {
    const totalSec = (this.activeEpisode()?.durationMinutes || 30) * 60;
    this.currentTimeSec.update((prev) => Math.max(0, Math.min(totalSec, prev + secondsDelta)));

    const sentences = this.activeEpisode().transcript;
    if (secondsDelta > 0 && this.currentSentenceIndex() < sentences.length - 1) {
      this.currentSentenceIndex.update((i) => i + 1);
      if (this.isPlaying()) this.speakCurrentSentence();
    } else if (secondsDelta < 0 && this.currentSentenceIndex() > 0) {
      this.currentSentenceIndex.update((i) => i - 1);
      if (this.isPlaying()) this.speakCurrentSentence();
    }
  }

  protected toggleTranscript(): void {
    this.showTranscript.update((v) => !v);
  }

  protected formatTime(secs: number): string {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  }

  // دالة تشغيل الصوت الآمنة بدون أخطاء TypeScript
  private speakCurrentSentence(): void {
    if (typeof window === 'undefined') return;
    const synth: SpeechSynthesis | undefined = (window as any).speechSynthesis;
    if (!synth) return;

    synth.cancel();

    const sentences = this.activeEpisode().transcript;
    const currentIdx = this.currentSentenceIndex();

    if (currentIdx >= sentences.length) {
      this.isPlaying.set(false);
      this.stopTimer();
      return;
    }

    const text = sentences[currentIdx];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = this.playbackSpeed();

    const voices: SpeechSynthesisVoice[] = synth.getVoices() || [];
    const naturalVoice =
      voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Natural') ||
            v.name.includes('Google') ||
            v.name.includes('Samantha') ||
            v.name.includes('Daniel') ||
            v.name.includes('Guy'))
      ) || voices.find((v) => v.lang.startsWith('en'));

    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onend = () => {
      if (this.isPlaying()) {
        const nextIdx = currentIdx + 1;
        if (nextIdx < sentences.length) {
          this.currentSentenceIndex.set(nextIdx);
          this.speakCurrentSentence();
        } else {
          this.isPlaying.set(false);
          this.stopTimer();
        }
      }
    };

    synth.speak(utterance);
  }

  private cancelSpeech(): void {
    if (typeof window !== 'undefined') {
      const synth: SpeechSynthesis | undefined = (window as any).speechSynthesis;
      if (synth) {
        synth.cancel();
      }
    }
  }

  private startTimer(): void {
    this.stopTimer();
    this.timer = setInterval(() => {
      this.currentTimeSec.update((v) => v + 1);
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}