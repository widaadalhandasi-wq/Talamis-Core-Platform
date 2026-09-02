using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Talamis.Data;
using Talamis.Models;

namespace Talamis.Repositories
{
    public class DailyPromptRepository : GenericRepository<DailyPrompt>, IDailyPromptRepository
    {
        public DailyPromptRepository(TalamisDbContext context) : base(context)
        {
        }

        public async Task<DailyPrompt?> GetByTargetDateAsync(DateTime targetDate) =>
            await _dbSet.AsNoTracking()
                .FirstOrDefaultAsync(p => p.TargetDate.Date == targetDate.Date);

        public async Task<IReadOnlyList<DailyPrompt>> GetUpcomingPromptsAsync(int count) =>
            await _dbSet.AsNoTracking()
                .Where(p => p.TargetDate >= DateTime.UtcNow.Date)
                .OrderBy(p => p.TargetDate)
                .Take(count)
                .ToListAsync();
    }
}
