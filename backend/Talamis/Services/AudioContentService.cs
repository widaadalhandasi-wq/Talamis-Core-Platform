using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Talamis.DTOs;
using Talamis.Models;
using Talamis.Repositories;

namespace Talamis.Services
{
    public class AudioContentService : IAudioContentService
    {
        private readonly IAudioContentRepository _repository;

        public AudioContentService(IAudioContentRepository repository)
        {
            _repository = repository;
        }

        public async Task<AudioContentDto?> GetByIdAsync(Guid id)
        {
            var audio = await _repository.GetByIdAsync(id);
            return audio is null ? null : ToDto(audio);
        }

        public async Task<IReadOnlyList<AudioContentDto>> GetAllAsync()
        {
            var items = await _repository.GetAllAsync();
            return items.Select(ToDto).ToList();
        }

        public async Task<IReadOnlyList<AudioContentDto>> GetByCategoryAsync(string category)
        {
            var items = await _repository.GetByCategoryAsync(category);
            return items.Select(ToDto).ToList();
        }

        public async Task<AudioContentDto> CreateAsync(CreateAudioContentDto dto)
        {
            var audio = new AudioContent
            {
                Title = dto.Title,
                Category = dto.Category,
                AudioUrl = dto.AudioUrl,
                TranscriptContent = dto.TranscriptContent,
                Duration = dto.Duration
            };

            await _repository.AddAsync(audio);
            await _repository.SaveChangesAsync();

            return ToDto(audio);
        }

        public async Task<bool> UpdateAsync(Guid id, UpdateAudioContentDto dto)
        {
            var audio = await _repository.GetByIdAsync(id);
            if (audio is null) return false;

            audio.Title = dto.Title;
            audio.Category = dto.Category;
            audio.AudioUrl = dto.AudioUrl;
            audio.TranscriptContent = dto.TranscriptContent;
            audio.Duration = dto.Duration;

            _repository.Update(audio);
            await _repository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var audio = await _repository.GetByIdAsync(id);
            if (audio is null) return false;

            _repository.Remove(audio);
            await _repository.SaveChangesAsync();
            return true;
        }

        private static AudioContentDto ToDto(AudioContent a) => new()
        {
            AudioId = a.AudioId,
            Title = a.Title,
            Category = a.Category,
            AudioUrl = a.AudioUrl,
            TranscriptContent = a.TranscriptContent,
            Duration = a.Duration
        };
    }
}
