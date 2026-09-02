using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Talamis.Models;

namespace Talamis.Data
{
    public class TalamisDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
    {
        public TalamisDbContext(DbContextOptions<TalamisDbContext> options) : base(options)
        {
        }

        public DbSet<DailyPrompt> DailyPrompts { get; set; } = null!;
        public DbSet<UserSubmission> UserSubmissions { get; set; } = null!;
        public DbSet<AudioContent> AudioContents { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // ---- ApplicationUser (1) -> UserSubmission (N) ----
            builder.Entity<ApplicationUser>()
                .HasMany(u => u.Submissions)
                .WithOne(s => s.User)
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade); // deleting a user deletes their submissions

            // ---- DailyPrompt (1) -> UserSubmission (N) ----
            builder.Entity<DailyPrompt>()
                .HasMany(p => p.Submissions)
                .WithOne(s => s.Prompt)
                .HasForeignKey(s => s.PromptId)
                .OnDelete(DeleteBehavior.Cascade); // deleting a prompt deletes its submissions

            // Store enum as readable string instead of int
            builder.Entity<DailyPrompt>()
                .Property(p => p.DifficultyLevel)
                .HasConversion<string>()
                .HasMaxLength(20);

            // Helpful indexes
            builder.Entity<DailyPrompt>()
                .HasIndex(p => p.TargetDate);

            builder.Entity<AudioContent>()
                .HasIndex(a => a.Category);

            // Explicit table names (optional, keeps DB tidy vs default Identity naming)
            builder.Entity<ApplicationUser>().ToTable("Users");
            builder.Entity<DailyPrompt>().ToTable("DailyPrompts");
            builder.Entity<UserSubmission>().ToTable("UserSubmissions");
            builder.Entity<AudioContent>().ToTable("AudioContents");
        }
    }
}
