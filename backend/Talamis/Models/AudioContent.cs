using System;
using System.ComponentModel.DataAnnotations;

namespace Talamis.Models
{
    public class AudioContent
    {
        [Key]
        public Guid AudioId { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? Category { get; set; }

        [Required]
        public string AudioUrl { get; set; } = string.Empty;

        public string? TranscriptContent { get; set; }

        public TimeSpan Duration { get; set; }
    }
}
