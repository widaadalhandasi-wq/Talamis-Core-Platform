using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Talamis.DTOs;
using Talamis.Models;
using Talamis.Repositories;

namespace Talamis.Services
{
    public class DailyPromptService : IDailyPromptService
    {
        private readonly IDailyPromptRepository _repository;

        public DailyPromptService(IDailyPromptRepository repository)
        {
            _repository = repository;
        }

        public async Task<DailyPromptDto?> GetByIdAsync(Guid id)
        {
            var prompt = await _repository.GetByIdAsync(id);
            return prompt is null ? null : ToDto(prompt);
        }

        public async Task<IReadOnlyList<DailyPromptDto>> GetAllAsync()
        {
            var prompts = await _repository.GetAllAsync();
            return prompts.Select(ToDto).ToList();
        }

        public async Task<IReadOnlyList<DailyPromptDto>> GetUpcomingAsync(int count)
        {
            var prompts = await _repository.GetUpcomingPromptsAsync(count);
            return prompts.Select(ToDto).ToList();
        }

        public async Task<DailyPromptDto> CreateAsync(CreateDailyPromptDto dto)
        {
            var prompt = new DailyPrompt
            {
                Title = dto.Title,
                QuestionText = dto.QuestionText,
                TargetDate = dto.TargetDate,
                ModelAudioUrl = dto.ModelAudioUrl,
                DifficultyLevel = dto.DifficultyLevel
            };

            await _repository.AddAsync(prompt);
            await _repository.SaveChangesAsync();

            return ToDto(prompt);
        }

        public async Task<bool> UpdateAsync(Guid id, UpdateDailyPromptDto dto)
        {
            var prompt = await _repository.GetByIdAsync(id);
            if (prompt is null) return false;

            prompt.Title = dto.Title;
            prompt.QuestionText = dto.QuestionText;
            prompt.TargetDate = dto.TargetDate;
            prompt.ModelAudioUrl = dto.ModelAudioUrl;
            prompt.DifficultyLevel = dto.DifficultyLevel;

            _repository.Update(prompt);
            await _repository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var prompt = await _repository.GetByIdAsync(id);
            if (prompt is null) return false;

            _repository.Remove(prompt);
            await _repository.SaveChangesAsync();
            return true;
        }

        private static DailyPromptDto ToDto(DailyPrompt p) => new()
        {
            PromptId = p.PromptId,
            Title = p.Title,
            QuestionText = p.QuestionText,
            TargetDate = p.TargetDate,
            ModelAudioUrl = p.ModelAudioUrl,
            DifficultyLevel = p.DifficultyLevel
        };
    }
}
