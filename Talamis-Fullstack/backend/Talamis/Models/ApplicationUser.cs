using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Talamis.Models
{
    /// <summary>
    /// Application user, extends Identity's IdentityUser with a Guid key.
    /// </summary>
    public class ApplicationUser : IdentityUser<Guid>
    {
        public string FullName { get; set; } = string.Empty;

        public int StreakCount { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property: one user has many submissions
        public virtual ICollection<UserSubmission> Submissions { get; set; } = new List<UserSubmission>();
    }
}
