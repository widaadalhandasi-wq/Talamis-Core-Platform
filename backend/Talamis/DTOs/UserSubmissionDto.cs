using System;

namespace Talamis.DTOs
{
    public class UserSubmissionDto
    {
        public Guid SubmissionId { get; set; }
        public Guid UserId { get; set; }
        public Guid PromptId { get; set; }
        public string? AudioFileUrl { get; set; }
        public string? TranscriptText { get; set; }
        public string? FeedbackJson { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateUserSubmissionDto
    {
        public Guid PromptId { get; set; }
        public string? AudioFileUrl { get; set; }
        public string? TranscriptText { get; set; }
        // UserId is intentionally excluded — it is taken from the authenticated
        // caller's JWT claims in the controller, never from client input.
    }
}
