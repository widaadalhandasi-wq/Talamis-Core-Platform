using System.Collections.Generic;
using Talamis.Models;

namespace Talamis.Services
{
    public interface ITokenService
    {
        (string Token, DateTime ExpiresAtUtc) GenerateToken(ApplicationUser user, IList<string> roles);
    }
}
