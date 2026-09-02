using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Talamis.Models
{
    public class DailyPrompt
    {
        [Key]
        public Guid PromptId { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string QuestionText { get; set; } = string.Empty;

        public DateTime TargetDate { get; set; }

        public string? ModelAudioUrl { get; set; }

        public DifficultyLevel DifficultyLevel { get; set; } = DifficultyLevel.Beginner;

        // Navigation property: one prompt has many submissions
        public virtual ICollection<UserSubmission> Submissions { get; set; } = new List<UserSubmission>();
    }

    public enum DifficultyLevel
    {
        Beginner = 0,
        Intermediate = 1,
        Advanced = 2
    }
}
