export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

// Mirrors Talamis.DTOs.DailyPromptDto
export interface DailyPrompt {
  promptId: string;
  title: string;
  questionText: string;
  targetDate: string;
  modelAudioUrl: string | null;
  difficultyLevel: DifficultyLevel;
}

// Mirrors Talamis.DTOs.CreateDailyPromptDto / UpdateDailyPromptDto
export interface CreateDailyPromptRequest {
  title: string;
  questionText: string;
  targetDate: string;
  modelAudioUrl?: string | null;
  difficultyLevel: DifficultyLevel;
}
