using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Talamis.DTOs;
using Talamis.Models;
using Talamis.Repositories;

namespace Talamis.Services
{
    public class UserSubmissionService : IUserSubmissionService
    {
        private readonly IUserSubmissionRepository _repository;

        public UserSubmissionService(IUserSubmissionRepository repository)
        {
            _repository = repository;
        }

        public async Task<UserSubmissionDto?> GetByIdAsync(Guid id)
        {
            var submission = await _repository.GetByIdAsync(id);
            return submission is null ? null : ToDto(submission);
        }

        public async Task<IReadOnlyList<UserSubmissionDto>> GetByUserIdAsync(Guid userId)
        {
            var submissions = await _repository.GetByUserIdAsync(userId);
            return submissions.Select(ToDto).ToList();
        }

        public async Task<IReadOnlyList<UserSubmissionDto>> GetByPromptIdAsync(Guid promptId)
        {
            var submissions = await _repository.GetByPromptIdAsync(promptId);
            return submissions.Select(ToDto).ToList();
        }

        public async Task<UserSubmissionDto> CreateAsync(Guid userId, CreateUserSubmissionDto dto)
        {
            var submission = new UserSubmission
            {
                UserId = userId,
                PromptId = dto.PromptId,
                AudioFileUrl = dto.AudioFileUrl,
                TranscriptText = dto.TranscriptText
            };

            await _repository.AddAsync(submission);
            await _repository.SaveChangesAsync();

            return ToDto(submission);
        }

        public async Task<bool> DeleteAsync(Guid id, Guid requestingUserId)
        {
            var submission = await _repository.GetByIdAsync(id);
            if (submission is null || submission.UserId != requestingUserId) return false;

            _repository.Remove(submission);
            await _repository.SaveChangesAsync();
            return true;
        }

        private static UserSubmissionDto ToDto(UserSubmission s) => new()
        {
            SubmissionId = s.SubmissionId,
            UserId = s.UserId,
            PromptId = s.PromptId,
            AudioFileUrl = s.AudioFileUrl,
            TranscriptText = s.TranscriptText,
            FeedbackJson = s.FeedbackJson,
            CreatedAt = s.CreatedAt
        };
    }
}
