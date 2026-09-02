using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Talamis.Models;

namespace Talamis.Repositories
{
    public interface IUserSubmissionRepository : IGenericRepository<UserSubmission>
    {
        Task<IReadOnlyList<UserSubmission>> GetByUserIdAsync(Guid userId);
        Task<IReadOnlyList<UserSubmission>> GetByPromptIdAsync(Guid promptId);
    }
}
