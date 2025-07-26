using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Xcianify.Core.DTOs.ItemMaster;
using Xcianify.Core.Domain.Services;

namespace Xcianify.Presentation.Controllers
{
    [Route("api/item-types")]
    public class ItemTypeController : BaseApiController
    {
        private readonly IItemTypeService _itemTypeService;
        private readonly ILogger<ItemTypeController> _logger;

        public ItemTypeController(
            IItemTypeService itemTypeService,
            ILogger<ItemTypeController> logger)
        {
            _itemTypeService = itemTypeService;
            _logger = logger;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var itemType = await _itemTypeService.GetByIdAsync(id);
            return Ok(itemType);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] ItemTypeFilterDto filter)
        {
            var result = await _itemTypeService.GetAllAsync(filter);
            return Ok(result);
        }

        [HttpGet("parent-types")]
        public async Task<IActionResult> GetParentTypes()
        {
            var parentTypes = await _itemTypeService.GetParentTypesAsync();
            return Ok(parentTypes);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateItemTypeDto dto)
        {

            var createdItemType = await _itemTypeService.CreateAsync(dto, CurrentUserId);
            return CreatedAtAction(nameof(GetById), new { id = createdItemType.Id }, createdItemType);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateItemTypeDto dto)
        {

            var updatedItemType = await _itemTypeService.UpdateAsync(id, dto, CurrentUserId);
            return Ok(updatedItemType);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _itemTypeService.DeleteAsync(id);
            if (!result)
            {
                return NotFound(new { message = "Item type not found" });
            }
            return NoContent();
        }
    }
}
