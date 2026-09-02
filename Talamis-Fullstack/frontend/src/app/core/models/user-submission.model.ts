// Mirrors Talamis.DTOs.UserSubmissionDto
export interface UserSubmission {
  submissionId: string;
  userId: string;
  promptId: string;
  audioFileUrl: string | null;
  transcriptText: string | null;
  feedbackJson: string | null;
  createdAt: string;
}

// Mirrors Talamis.DTOs.CreateUserSubmissionDto
export interface CreateUserSubmissionRequest {
  promptId: string;
  audioFileUrl?: string | null;
  transcriptText?: string | null;
}
