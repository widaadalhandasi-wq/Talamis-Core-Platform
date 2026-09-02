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
    public class AudioContentsController : ControllerBase
    {
        private readonly IAudioContentService _service;

        public AudioContentsController(IAudioContentService service)
        {
            _service = service;
        }

        // GET: api/audiocontents
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _service.GetAllAsync();
            return Ok(items);
        }

        // GET: api/audiocontents/category/{category}
        [HttpGet("category/{category}")]
        public async Task<IActionResult> GetByCategory(string category)
        {
            var items = await _service.GetByCategoryAsync(category);
            return Ok(items);
        }

        // GET: api/audiocontents/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var audio = await _service.GetByIdAsync(id);
            return audio is null ? NotFound() : Ok(audio);
        }

        // POST: api/audiocontents
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CreateAudioContentDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.AudioId }, created);
        }

        // PUT: api/audiocontents/{id}
        [HttpPut("{id:guid}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateAudioContentDto dto)
        {
            var updated = await _service.UpdateAsync(id, dto);
            return updated ? NoContent() : NotFound();
        }

        // DELETE: api/audiocontents/{id}
        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _service.DeleteAsync(id);
            return deleted ? NoContent() : NotFound();
        }
    }
}
