using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs.ItemMaster;

namespace Xcianify.Presentation.Controllers
{
    [Route("api/items/{itemId}/stock-analysis")]
    public class ItemStockAnalysisController : BaseApiController
    {
        private readonly IItemStockAnalysisService _stockAnalysisService;

        public ItemStockAnalysisController(
            IItemStockAnalysisService stockAnalysisService,
            ILogger<ItemStockAnalysisController> logger)
        {
            _stockAnalysisService = stockAnalysisService ?? throw new ArgumentNullException(nameof(stockAnalysisService));
        }

        [HttpGet]
        public async Task<IActionResult> GetByItemId(int itemId)
        {
            var stockAnalysis = await _stockAnalysisService.GetByItemIdAsync(itemId);
            return Ok(stockAnalysis);
        }

        [HttpPost]
        public async Task<IActionResult> Create(int itemId, [FromBody] CreateItemStockAnalysisDto dto)
        {
            dto.ItemId = itemId; // Ensure the item ID from route is used
            var result = await _stockAnalysisService.CreateAsync(dto, CurrentUserId);
            return CreatedAtAction(
                nameof(GetByItemId), 
                new { itemId = result.ItemId }, 
                result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int itemId, int id, [FromBody] UpdateItemStockAnalysisDto dto)
        {
            var result = await _stockAnalysisService.UpdateAsync(id, dto, CurrentUserId);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int itemId, int id)
        {
            var success = await _stockAnalysisService.DeleteAsync(id);
            if (!success)
                return NotFound(new { message = "Stock analysis not found" });

            return NoContent();
        }
    }
}
