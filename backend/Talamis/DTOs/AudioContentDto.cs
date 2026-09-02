using System;

namespace Talamis.DTOs
{
    public class AudioContentDto
    {
        public Guid AudioId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Category { get; set; }
        public string AudioUrl { get; set; } = string.Empty;
        public string? TranscriptContent { get; set; }
        public TimeSpan Duration { get; set; }
    }

    public class CreateAudioContentDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Category { get; set; }
        public string AudioUrl { get; set; } = string.Empty;
        public string? TranscriptContent { get; set; }
        public TimeSpan Duration { get; set; }
    }

    public class UpdateAudioContentDto : CreateAudioContentDto
    {
    }
}
