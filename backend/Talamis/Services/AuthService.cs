using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Talamis.DTOs;
using Talamis.Models;

namespace Talamis.Services
{
    /// <summary>
    /// Handles registration and login. Password hashing/verification is delegated to
    /// ASP.NET Core Identity's UserManager (PBKDF2 under the hood) — no need to hash
    /// passwords manually here.
    /// </summary>
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ITokenService _tokenService;

        public AuthService(UserManager<ApplicationUser> userManager, ITokenService tokenService)
        {
            _userManager = userManager;
            _tokenService = tokenService;
        }

        public async Task<(bool Succeeded, string[] Errors, AuthResponseDto? Result)> RegisterAsync(RegisterDto dto)
        {
            var existing = await _userManager.FindByEmailAsync(dto.Email);
            if (existing is not null)
            {
                return (false, new[] { "A user with this email already exists." }, null);
            }

            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                FullName = dto.FullName,
                CreatedAt = DateTime.UtcNow
            };

            var createResult = await _userManager.CreateAsync(user, dto.Password);
            if (!createResult.Succeeded)
            {
                return (false, createResult.Errors.Select(e => e.Description).ToArray(), null);
            }

            var roles = await _userManager.GetRolesAsync(user);
            var (token, expiresAt) = _tokenService.GenerateToken(user, roles);

            return (true, Array.Empty<string>(), new AuthResponseDto
            {
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email!,
                Token = token,
                ExpiresAtUtc = expiresAt
            });
        }

        public async Task<(bool Succeeded, string[] Errors, AuthResponseDto? Result)> LoginAsync(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user is null || !await _userManager.CheckPasswordAsync(user, dto.Password))
            {
                return (false, new[] { "Invalid email or password." }, null);
            }

            var roles = await _userManager.GetRolesAsync(user);
            var (token, expiresAt) = _tokenService.GenerateToken(user, roles);

            return (true, Array.Empty<string>(), new AuthResponseDto
            {
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email!,
                Token = token,
                ExpiresAtUtc = expiresAt
            });
        }
    }
}
