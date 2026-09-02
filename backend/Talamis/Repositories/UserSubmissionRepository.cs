using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Talamis.Data;
using Talamis.Models;

namespace Talamis.Repositories
{
    public class UserSubmissionRepository : GenericRepository<UserSubmission>, IUserSubmissionRepository
    {
        public UserSubmissionRepository(TalamisDbContext context) : base(context)
        {
        }

        public async Task<IReadOnlyList<UserSubmission>> GetByUserIdAsync(Guid userId) =>
            await _dbSet.AsNoTracking()
                .Where(s => s.UserId == userId)
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();

        public async Task<IReadOnlyList<UserSubmission>> GetByPromptIdAsync(Guid promptId) =>
            await _dbSet.AsNoTracking()
                .Where(s => s.PromptId == promptId)
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();
    }
}
