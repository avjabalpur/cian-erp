using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs.ItemMedia;

namespace Xcianify.Presentation.Controllers
{
    [Route("api/items/{itemId}/media")]
    public class ItemMediaController : BaseApiController
    {
        private readonly IItemMediaService _service;

        public ItemMediaController(IItemMediaService service)
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
        public async Task<IActionResult> Create(int itemId, CreateItemMediaDto createDto)
        {
            var userId = CurrentUserId;
            if (userId <= 0)
                return Unauthorized(new { message = "Invalid user" });

            createDto.ItemId = itemId; // Ensure the itemId from route is used
            var result = await _service.CreateAsync(createDto, userId);
            return CreatedAtAction(nameof(GetById), new { id = result.Id, itemId }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int itemId, int id, UpdateItemMediaDto updateDto)
        {
            var userId = CurrentUserId;
            if (userId <= 0)
                return Unauthorized(new { message = "Invalid user" });

            // Ensure we're updating a media that belongs to the specified item
            var media = await _service.GetByIdAsync(id);
            if (media == null || media.ItemId != itemId)
                return NotFound();

            var result = await _service.UpdateAsync(id, updateDto, userId);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int itemId, int id)
        {

            // Ensure we're deleting a media that belongs to the specified item
            var media = await _service.GetByIdAsync(id);
            if (media == null || media.ItemId != itemId)
                return NotFound();

            var success = await _service.DeleteAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}
