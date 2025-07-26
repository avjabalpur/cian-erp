using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Xcianify.Core.DTOs.ItemMaster;
using Xcianify.Core.Domain.Services;

namespace Xcianify.Presentation.Controllers
{
    [Route("api/hsn-master")]
    public class HsnMasterController : BaseApiController
    {
        private readonly IHsnMasterService _hsnMasterService;
        private readonly ILogger<HsnMasterController> _logger;

        public HsnMasterController(
            IHsnMasterService hsnMasterService,
            ILogger<HsnMasterController> logger)
        {
            _hsnMasterService = hsnMasterService;
            _logger = logger;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var hsn = await _hsnMasterService.GetByIdAsync(id);
            return Ok(hsn);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] HsnMasterFilterDto filter)
        {
            var result = await _hsnMasterService.GetAllAsync(filter);
            return Ok(result);
        }

        [HttpGet("hsn-types")]
        public async Task<IActionResult> GetHsnTypes()
        {
            var hsnTypes = await _hsnMasterService.GetHsnTypesAsync();
            return Ok(hsnTypes);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateHsnMasterDto dto)
        {
            // Get current user ID from claims
            var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0");
            if (userId <= 0)
            {
                return Unauthorized(new { message = "Invalid user" });
            }

            var createdHsn = await _hsnMasterService.CreateAsync(dto, userId);
            return CreatedAtAction(nameof(GetById), new { id = createdHsn.Id }, createdHsn);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateHsnMasterDto dto)
        {

            // Get current user ID from claims
            var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0");
            if (userId <= 0)
            {
                return Unauthorized(new { message = "Invalid user" });
            }

            var updatedHsn = await _hsnMasterService.UpdateAsync(id, dto, userId);
            return Ok(updatedHsn);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _hsnMasterService.DeleteAsync(id);
            if (!result)
            {
                return NotFound(new { message = "HSN code not found" });
            }
            return NoContent();
        }
    }
}
