// Mirrors Talamis.DTOs.AudioContentDto
export interface AudioContent {
  audioId: string;
  title: string;
  category: string | null;
  audioUrl: string;
  transcriptContent: string | null;
  // .NET serializes TimeSpan as "hh:mm:ss" (e.g. "00:12:34")
  duration: string;
}

// Mirrors Talamis.DTOs.CreateAudioContentDto / UpdateAudioContentDto
export interface CreateAudioContentRequest {
  title: string;
  category?: string | null;
  audioUrl: string;
  transcriptContent?: string | null;
  duration: string;
}
