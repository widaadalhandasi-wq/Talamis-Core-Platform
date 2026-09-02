using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Talamis.Models;

namespace Talamis.Repositories
{
    public interface IDailyPromptRepository : IGenericRepository<DailyPrompt>
    {
        Task<DailyPrompt?> GetByTargetDateAsync(DateTime targetDate);
        Task<IReadOnlyList<DailyPrompt>> GetUpcomingPromptsAsync(int count);
    }
}
