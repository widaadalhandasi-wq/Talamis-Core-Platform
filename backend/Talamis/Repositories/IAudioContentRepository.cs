using System.Collections.Generic;
using System.Threading.Tasks;
using Talamis.Models;

namespace Talamis.Repositories
{
    public interface IAudioContentRepository : IGenericRepository<AudioContent>
    {
        Task<IReadOnlyList<AudioContent>> GetByCategoryAsync(string category);
    }
}
