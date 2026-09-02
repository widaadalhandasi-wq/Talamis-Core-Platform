using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Talamis.DTOs;
using Talamis.Services;

namespace Talamis.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserSubmissionsController : ControllerBase
    {
        private readonly IUserSubmissionService _service;

        public UserSubmissionsController(IUserSubmissionService service)
        {
            _service = service;
        }

        // GET: api/usersubmissions/mine
        [HttpGet("mine")]
        public async Task<IActionResult> GetMine()
        {
            var submissions = await _service.GetByUserIdAsync(CurrentUserId);
            return Ok(submissions);
        }

        // GET: api/usersubmissions/prompt/{promptId}
        [HttpGet("prompt/{promptId:guid}")]
        public async Task<IActionResult> GetByPrompt(Guid promptId)
        {
            var submissions = await _service.GetByPromptIdAsync(promptId);
            return Ok(submissions);
        }

        // GET: api/usersubmissions/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var submission = await _service.GetByIdAsync(id);
            return submission is null ? NotFound() : Ok(submission);
        }

        // POST: api/usersubmissions
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateUserSubmissionDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var created = await _service.CreateAsync(CurrentUserId, dto);
            return CreatedAtAction(nameof(GetById), new { id = created.SubmissionId }, created);
        }

        // DELETE: api/usersubmissions/{id}
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _service.DeleteAsync(id, CurrentUserId);
            return deleted ? NoContent() : NotFound();
        }

        // Pulled from the JWT "sub"/NameIdentifier claim set by TokenService
        private Guid CurrentUserId =>
            Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }
}
