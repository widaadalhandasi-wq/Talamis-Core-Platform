using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Talamis.DTOs;

namespace Talamis.Services
{
    public interface IAudioContentService
    {
        Task<AudioContentDto?> GetByIdAsync(Guid id);
        Task<IReadOnlyList<AudioContentDto>> GetAllAsync();
        Task<IReadOnlyList<AudioContentDto>> GetByCategoryAsync(string category);
        Task<AudioContentDto> CreateAsync(CreateAudioContentDto dto);
        Task<bool> UpdateAsync(Guid id, UpdateAudioContentDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}
