using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Talamis.DTOs;

namespace Talamis.Services
{
    public interface IDailyPromptService
    {
        Task<DailyPromptDto?> GetByIdAsync(Guid id);
        Task<IReadOnlyList<DailyPromptDto>> GetAllAsync();
        Task<IReadOnlyList<DailyPromptDto>> GetUpcomingAsync(int count);
        Task<DailyPromptDto> CreateAsync(CreateDailyPromptDto dto);
        Task<bool> UpdateAsync(Guid id, UpdateDailyPromptDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}
