using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs.ItemExportDetails;

namespace Xcianify.Presentation.Controllers
{
    [Route("api/items/{itemId}/export-details")]
    public class ItemExportDetailsController : BaseApiController
    {
        private readonly IItemExportDetailsService _service;

        public ItemExportDetailsController(IItemExportDetailsService service)
        {
            _service = service ?? throw new ArgumentNullException(nameof(service));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetByItemId(int itemId)
        {
            var result = await _service.GetByItemIdAsync(itemId);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create(int itemId, CreateItemExportDetailsDto createDto)
        {
            var userId = CurrentUserId;
            if (userId <= 0)
                return Unauthorized(new { message = "Invalid user" });

            var result = await _service.CreateAsync(createDto, userId);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateItemExportDetailsDto updateDto)
        {
            var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0");
            if (userId <= 0)
                return Unauthorized(new { message = "Invalid user" });

            var result = await _service.UpdateAsync(id, updateDto, userId);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            if (!deleted)
                return NotFound();
            return NoContent();
        }
    }
}
