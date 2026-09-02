using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Talamis.DTOs;
using Talamis.Services;

namespace Talamis.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var (succeeded, errors, result) = await _authService.RegisterAsync(dto);
            return succeeded ? Ok(result) : BadRequest(new { errors });
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var (succeeded, errors, result) = await _authService.LoginAsync(dto);
            return succeeded ? Ok(result) : Unauthorized(new { errors });
        }
    }
}
