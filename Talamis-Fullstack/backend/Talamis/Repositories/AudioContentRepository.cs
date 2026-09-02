using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Talamis.Data;
using Talamis.Models;

namespace Talamis.Repositories
{
    public class AudioContentRepository : GenericRepository<AudioContent>, IAudioContentRepository
    {
        public AudioContentRepository(TalamisDbContext context) : base(context)
        {
        }

        public async Task<IReadOnlyList<AudioContent>> GetByCategoryAsync(string category) =>
            await _dbSet.AsNoTracking()
                .Where(a => a.Category == category)
                .ToListAsync();
    }
}
