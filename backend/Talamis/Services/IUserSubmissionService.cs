using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Talamis.DTOs;

namespace Talamis.Services
{
    public interface IUserSubmissionService
    {
        Task<UserSubmissionDto?> GetByIdAsync(Guid id);
        Task<IReadOnlyList<UserSubmissionDto>> GetByUserIdAsync(Guid userId);
        Task<IReadOnlyList<UserSubmissionDto>> GetByPromptIdAsync(Guid promptId);
        Task<UserSubmissionDto> CreateAsync(Guid userId, CreateUserSubmissionDto dto);
        Task<bool> DeleteAsync(Guid id, Guid requestingUserId);
    }
}
