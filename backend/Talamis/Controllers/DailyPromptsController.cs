using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Talamis.DTOs;
using Talamis.Services;

namespace Talamis.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DailyPromptsController : ControllerBase
    {
        private readonly IDailyPromptService _service;

        public DailyPromptsController(IDailyPromptService service)
        {
            _service = service;
        }

        // GET: api/dailyprompts
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var prompts = await _service.GetAllAsync();
            return Ok(prompts);
        }

        // GET: api/dailyprompts/upcoming?count=7
        [HttpGet("upcoming")]
        public async Task<IActionResult> GetUpcoming([FromQuery] int count = 7)
        {
            var prompts = await _service.GetUpcomingAsync(count);
            return Ok(prompts);
        }

        // GET: api/dailyprompts/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var prompt = await _service.GetByIdAsync(id);
            return prompt is null ? NotFound() : Ok(prompt);
        }

        // POST: api/dailyprompts
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CreateDailyPromptDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.PromptId }, created);
        }

        // PUT: api/dailyprompts/{id}
        [HttpPut("{id:guid}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateDailyPromptDto dto)
        {
            var updated = await _service.UpdateAsync(id, dto);
            return updated ? NoContent() : NotFound();
        }

        // DELETE: api/dailyprompts/{id}
        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _service.DeleteAsync(id);
            return deleted ? NoContent() : NotFound();
        }
    }
}
