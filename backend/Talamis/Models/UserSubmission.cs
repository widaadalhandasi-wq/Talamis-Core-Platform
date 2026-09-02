using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Talamis.Models
{
    public class UserSubmission
    {
        [Key]
        public Guid SubmissionId { get; set; } = Guid.NewGuid();

        [Required]
        public Guid UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; } = null!;

        [Required]
        public Guid PromptId { get; set; }

        [ForeignKey(nameof(PromptId))]
        public virtual DailyPrompt Prompt { get; set; } = null!;

        public string? AudioFileUrl { get; set; }

        public string? TranscriptText { get; set; }

        // Stores structured AI feedback (scores, corrections, etc.) as raw JSON
        public string? FeedbackJson { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
