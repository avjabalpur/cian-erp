using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs.ItemOtherDetails;

namespace Xcianify.Presentation.Controllers
{
    [Route("api/items/{itemId}/other-details")]
    public class ItemOtherDetailsController : BaseApiController
    {
        private readonly IItemOtherDetailsService _service;

        public ItemOtherDetailsController(IItemOtherDetailsService service)
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
        public async Task<IActionResult> Create(int itemId, CreateItemOtherDetailsDto createDto)
        {
            var userId = CurrentUserId;
            if (userId <= 0)
                return Unauthorized(new { message = "Invalid user" });

            createDto.ItemId = itemId; // Ensure the itemId from route is used
            var result = await _service.CreateAsync(createDto, userId);
            return CreatedAtAction(nameof(GetById), new { id = result.Id, itemId }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int itemId, int id, UpdateItemOtherDetailsDto updateDto)
        {
            var userId = CurrentUserId;
            if (userId <= 0)
                return Unauthorized(new { message = "Invalid user" });

            // Ensure we're updating details that belong to the specified item
            var details = await _service.GetByIdAsync(id);
            if (details == null || details.ItemId != itemId)
                return NotFound();

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
