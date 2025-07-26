using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Xcianify.Core.DTOs.ItemMaster;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.Exceptions;

namespace Xcianify.Presentation.Controllers
{
    [Route("api/items")]
    public class ItemMasterController : BaseApiController
    {
        private readonly IItemMasterService _itemMasterService;
        private readonly ILogger<ItemMasterController> _logger;

        public ItemMasterController(
            IItemMasterService itemMasterService,
            ILogger<ItemMasterController> logger)
        {
            _itemMasterService = itemMasterService ?? throw new ArgumentNullException(nameof(itemMasterService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] ItemMasterFilterDto filter)
        {
            var (items, totalCount) = await _itemMasterService.GetAllItemsAsync(filter);
            return Ok(new { items, totalCount });

        }

        [HttpGet("{itemId}")]
        public async Task<IActionResult> GetById(int itemId)
        {
            var item = await _itemMasterService.GetItemByIdAsync(itemId);
            return Ok(item);
        }

        [HttpGet("code/{itemCode}")]
        public async Task<IActionResult> GetByItemCode(string itemCode)
        {
            var item = await _itemMasterService.GetItemByCodeAsync(itemCode);
            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateItemMasterDto createDto)
        {
            var item = await _itemMasterService.CreateItemAsync(createDto);
            return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
        }

        [HttpPut("{itemId}")]
        public async Task<IActionResult> Update(int itemId, [FromBody] UpdateItemMasterDto updateDto)
        {
            var item = await _itemMasterService.UpdateItemAsync(itemId, updateDto);
            return Ok(item);
        }

        [HttpDelete("{itemId}")]
        public async Task<IActionResult> Delete(int itemId)
        {
            await _itemMasterService.DeleteItemAsync(itemId);
            return NoContent();
        }

    }
}
