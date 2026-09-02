using System;
using Talamis.Models;

namespace Talamis.DTOs
{
    public class DailyPromptDto
    {
        public Guid PromptId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string QuestionText { get; set; } = string.Empty;
        public DateTime TargetDate { get; set; }
        public string? ModelAudioUrl { get; set; }
        public DifficultyLevel DifficultyLevel { get; set; }
    }

    public class CreateDailyPromptDto
    {
        public string Title { get; set; } = string.Empty;
        public string QuestionText { get; set; } = string.Empty;
        public DateTime TargetDate { get; set; }
        public string? ModelAudioUrl { get; set; }
        public DifficultyLevel DifficultyLevel { get; set; } = DifficultyLevel.Beginner;
    }

    public class UpdateDailyPromptDto : CreateDailyPromptDto
    {
    }
}
