using Talamis.DTOs;

namespace Talamis.Services
{
    public interface IAuthService
    {
        Task<(bool Succeeded, string[] Errors, AuthResponseDto? Result)> RegisterAsync(RegisterDto dto);
        Task<(bool Succeeded, string[] Errors, AuthResponseDto? Result)> LoginAsync(LoginDto dto);
    }
}
