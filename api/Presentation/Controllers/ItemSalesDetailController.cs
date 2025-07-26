using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs.ItemMaster;

namespace Xcianify.Presentation.Controllers
{
    [Route("api/items/{itemId}/sales-details")]
    public class ItemSalesDetailController : BaseApiController
    {
        private readonly IItemSalesDetailService _salesDetailService;
        private readonly ILogger<ItemSalesDetailController> _logger;

        public ItemSalesDetailController(
            IItemSalesDetailService salesDetailService,
            ILogger<ItemSalesDetailController> logger)
        {
            _salesDetailService = salesDetailService ?? throw new ArgumentNullException(nameof(salesDetailService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [HttpGet]
        public async Task<IActionResult> GetByItemId(int itemId)
        {
            var salesDetail = await _salesDetailService.GetByItemIdAsync(itemId);
            return Ok(salesDetail);
        }

        [HttpPost]
        public async Task<IActionResult> Create(int itemId, [FromBody] CreateItemSalesDetailDto dto)
        {
            var userId = CurrentUserId;
            if (userId <= 0)
            {
                return Unauthorized(new { message = "Invalid user" });
            }

            dto.ItemId = itemId; // Ensure the item ID from route is used
            var result = await _salesDetailService.CreateAsync(dto, userId);
            return CreatedAtAction(
                nameof(GetByItemId), 
                new { itemId = result.ItemId }, 
                result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int itemId, int id, [FromBody] UpdateItemSalesDetailDto dto)
        {
            var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0");
            if (userId <= 0)
            {
                return Unauthorized(new { message = "Invalid user" });
            }

            var result = await _salesDetailService.UpdateAsync(id, dto, userId);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int itemMasterId, int id)
        {
            try
            {
                var success = await _salesDetailService.DeleteAsync(id);
                if (!success)
                    return NotFound(new { message = "Sales detail not found" });

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting sales detail ID: {id}");
                return StatusCode(500, new { message = "An error occurred while deleting sales detail" });
            }
        }
    }
}
