using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Xcianify.Core.DTOs.ItemMaster;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.Exceptions;
using Xcianify.Core.DTOs.ItemMedia;
using Xcianify.Core.DTOs.ItemOtherDetails;
using Xcianify.Core.DTOs.ItemExportDetails;

namespace Xcianify.Presentation.Controllers
{
    [Route("api/items")]
    public class ItemMasterController : BaseApiController
    {
        private readonly IItemMasterService _itemMasterService;
        private readonly IItemMediaService _itemMediaService;
        private readonly IItemOtherDetailsService _itemOtherDetailsService;
        private readonly IItemSalesDetailService _itemSalesDetailService;
        private readonly IItemExportDetailsService _itemExportDetailsService;
        private readonly IItemStockAnalysisService _itemStockAnalysisService;
        private readonly IItemSpecificationService _itemSpecificationService;
        private readonly IItemBoughtOutDetailsService _itemBoughtOutDetailsService;
        private readonly ILogger<ItemMasterController> _logger;

        public ItemMasterController(
            IItemMasterService itemMasterService,
            IItemMediaService itemMediaService,
            IItemOtherDetailsService itemOtherDetailsService,
            IItemSalesDetailService itemSalesDetailService,
            IItemExportDetailsService itemExportDetailsService,
            IItemStockAnalysisService itemStockAnalysisService,
            IItemSpecificationService itemSpecificationService,
            IItemBoughtOutDetailsService itemBoughtOutDetailsService,
            ILogger<ItemMasterController> logger)
        {
            _itemMasterService = itemMasterService ?? throw new ArgumentNullException(nameof(itemMasterService));
            _itemMediaService = itemMediaService ?? throw new ArgumentNullException(nameof(itemMediaService));
            _itemOtherDetailsService = itemOtherDetailsService ?? throw new ArgumentNullException(nameof(itemOtherDetailsService));
            _itemSalesDetailService = itemSalesDetailService ?? throw new ArgumentNullException(nameof(itemSalesDetailService));
            _itemExportDetailsService = itemExportDetailsService ?? throw new ArgumentNullException(nameof(itemExportDetailsService));
            _itemStockAnalysisService = itemStockAnalysisService ?? throw new ArgumentNullException(nameof(itemStockAnalysisService));
            _itemSpecificationService = itemSpecificationService ?? throw new ArgumentNullException(nameof(itemSpecificationService));
            _itemBoughtOutDetailsService = itemBoughtOutDetailsService ?? throw new ArgumentNullException(nameof(itemBoughtOutDetailsService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        // --- Item Master Endpoints ---

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

        // --- Item Media Endpoints ---

        [HttpGet("{itemId}/media")]
        public async Task<IActionResult> GetMediaByItemId(int itemId)
        {
            var result = await _itemMediaService.GetByItemIdAsync(itemId);
            return Ok(result);
        }

        [HttpGet("{itemId}/media/{id}")]
        public async Task<IActionResult> GetMediaById(int itemId, int id)
        {
            var result = await _itemMediaService.GetByIdAsync(id);
            if (result == null || result.ItemId != itemId)
                return NotFound();
            return Ok(result);
        }

        [HttpPost("{itemId}/media")]
        public async Task<IActionResult> CreateMedia(int itemId, [FromBody] CreateItemMediaDto createDto)
        {
            var userId = CurrentUserId;
            if (userId <= 0)
                return Unauthorized(new { message = "Invalid user" });

            createDto.ItemId = itemId;
            var result = await _itemMediaService.CreateAsync(createDto, userId);
            return CreatedAtAction(nameof(GetMediaById), new { itemId, id = result.Id }, result);
        }

        [HttpPut("{itemId}/media/{id}")]
        public async Task<IActionResult> UpdateMedia(int itemId, int id, [FromBody] UpdateItemMediaDto updateDto)
        {
            var userId = CurrentUserId;
            if (userId <= 0)
                return Unauthorized(new { message = "Invalid user" });

            var media = await _itemMediaService.GetByIdAsync(id);
            if (media == null || media.ItemId != itemId)
                return NotFound();

            var result = await _itemMediaService.UpdateAsync(id, updateDto, userId);
            return Ok(result);
        }

        [HttpDelete("{itemId}/media/{id}")]
        public async Task<IActionResult> DeleteMedia(int itemId, int id)
        {
            var media = await _itemMediaService.GetByIdAsync(id);
            if (media == null || media.ItemId != itemId)
                return NotFound();

            var success = await _itemMediaService.DeleteAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }

        // --- Item Other Details Endpoints ---

        [HttpGet("{itemId}/other-details")]
        public async Task<IActionResult> GetOtherDetailsByItemId(int itemId)
        {
            var result = await _itemOtherDetailsService.GetByItemIdAsync(itemId);
            return Ok(result);
        }

        [HttpGet("{itemId}/other-details/{id}")]
        public async Task<IActionResult> GetOtherDetailsById(int itemId, int id)
        {
            var result = await _itemOtherDetailsService.GetByIdAsync(id);
            if (result == null || result.ItemId != itemId)
                return NotFound();
            return Ok(result);
        }

        [HttpPost("{itemId}/other-details")]
        public async Task<IActionResult> CreateOtherDetails(int itemId, [FromBody] CreateItemOtherDetailsDto createDto)
        {
            var userId = CurrentUserId;
            if (userId <= 0)
                return Unauthorized(new { message = "Invalid user" });

            createDto.ItemId = itemId;
            var result = await _itemOtherDetailsService.CreateAsync(createDto, userId);
            return CreatedAtAction(nameof(GetOtherDetailsById), new { itemId, id = result.Id }, result);
        }

        [HttpPut("{itemId}/other-details/{id}")]
        public async Task<IActionResult> UpdateOtherDetails(int itemId, int id, [FromBody] UpdateItemOtherDetailsDto updateDto)
        {
            var userId = CurrentUserId;
            if (userId <= 0)
                return Unauthorized(new { message = "Invalid user" });

            var details = await _itemOtherDetailsService.GetByIdAsync(id);
            if (details == null || details.ItemId != itemId)
                return NotFound();

            var result = await _itemOtherDetailsService.UpdateAsync(id, updateDto, userId);
            return Ok(result);
        }

        [HttpDelete("{itemId}/other-details/{id}")]
        public async Task<IActionResult> DeleteOtherDetails(int itemId, int id)
        {
            var details = await _itemOtherDetailsService.GetByIdAsync(id);
            if (details == null || details.ItemId != itemId)
                return NotFound();

            var deleted = await _itemOtherDetailsService.DeleteAsync(id);
            if (!deleted)
                return NotFound();
            return NoContent();
        }

        // --- Item Sales Details Endpoints ---

        [HttpGet("{itemId}/sales-details")]
        public async Task<IActionResult> GetSalesDetailsByItemId(int itemId)
        {
            var salesDetail = await _itemSalesDetailService.GetByItemIdAsync(itemId);
            return Ok(salesDetail);
        }

        [HttpPost("{itemId}/sales-details")]
        public async Task<IActionResult> CreateSalesDetails(int itemId, [FromBody] CreateItemSalesDetailDto dto)
        {
            var userId = CurrentUserId;
            if (userId <= 0)
                return Unauthorized(new { message = "Invalid user" });

            dto.ItemId = itemId;
            var result = await _itemSalesDetailService.CreateAsync(dto, userId);
            return CreatedAtAction(nameof(GetSalesDetailsByItemId), new { itemId }, result);
        }

        [HttpPut("{itemId}/sales-details/{id}")]
        public async Task<IActionResult> UpdateSalesDetails(int itemId, int id, [FromBody] UpdateItemSalesDetailDto dto)
        {
            var userId = CurrentUserId;
            if (userId <= 0)
                return Unauthorized(new { message = "Invalid user" });

            var result = await _itemSalesDetailService.UpdateAsync(id, dto, userId);
            return Ok(result);
        }

        [HttpDelete("{itemId}/sales-details/{id}")]
        public async Task<IActionResult> DeleteSalesDetails(int itemId, int id)
        {
            try
            {
                var success = await _itemSalesDetailService.DeleteAsync(id);
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

        // --- Item Export Details Endpoints ---

        [HttpGet("{itemId}/export-details")]
        public async Task<IActionResult> GetExportDetailsByItemId(int itemId)
        {
            var result = await _itemExportDetailsService.GetByItemIdAsync(itemId);
            return Ok(result);
        }

        [HttpGet("{itemId}/export-details/{id}")]
        public async Task<IActionResult> GetExportDetailsById(int itemId, int id)
        {
            var result = await _itemExportDetailsService.GetByIdAsync(id);
            if (result == null)
                return NotFound();
            return Ok(result);
        }

        [HttpPost("{itemId}/export-details")]
        public async Task<IActionResult> CreateExportDetails(int itemId, [FromBody] CreateItemExportDetailsDto createDto)
        {
            var userId = CurrentUserId;
            if (userId <= 0)
                return Unauthorized(new { message = "Invalid user" });

            createDto.ItemId = itemId;
            var result = await _itemExportDetailsService.CreateAsync(createDto, userId);
            return CreatedAtAction(nameof(GetExportDetailsById), new { itemId, id = result.Id }, result);
        }

        [HttpPut("{itemId}/export-details/{id}")]
        public async Task<IActionResult> UpdateExportDetails(int itemId, int id, [FromBody] UpdateItemExportDetailsDto updateDto)
        {
            var userId = CurrentUserId;
            if (userId <= 0)
                return Unauthorized(new { message = "Invalid user" });

            var details = await _itemExportDetailsService.GetByIdAsync(id);
            if (details == null || details.ItemId != itemId)
                return NotFound();

            var result = await _itemExportDetailsService.UpdateAsync(id, updateDto, userId);
            return Ok(result);
        }

        [HttpDelete("{itemId}/export-details/{id}")]
        public async Task<IActionResult> DeleteExportDetails(int itemId, int id)
        {
            var details = await _itemExportDetailsService.GetByIdAsync(id);
            if (details == null || details.ItemId != itemId)
                return NotFound();

            var deleted = await _itemExportDetailsService.DeleteAsync(id);
            if (!deleted)
                return NotFound();
            return NoContent();
        }

        // --- Item Stock Analysis Endpoints ---

        [HttpGet("{itemId}/stock-analysis")]
        public async Task<IActionResult> GetStockAnalysisByItemId(int itemId)
        {
            var stockAnalysis = await _itemStockAnalysisService.GetByItemIdAsync(itemId);
            return Ok(stockAnalysis);
        }

        [HttpPost("{itemId}/stock-analysis")]
        public async Task<IActionResult> CreateStockAnalysis(int itemId, [FromBody] CreateItemStockAnalysisDto dto)
        {
            dto.ItemId = itemId;
            var result = await _itemStockAnalysisService.CreateAsync(dto, CurrentUserId);
            return CreatedAtAction(nameof(GetStockAnalysisByItemId), new { itemId }, result);
        }

        [HttpPut("{itemId}/stock-analysis/{id}")]
        public async Task<IActionResult> UpdateStockAnalysis(int itemId, int id, [FromBody] UpdateItemStockAnalysisDto dto)
        {
            var result = await _itemStockAnalysisService.UpdateAsync(id, dto, CurrentUserId);
            return Ok(result);
        }

        [HttpDelete("{itemId}/stock-analysis/{id}")]
        public async Task<IActionResult> DeleteStockAnalysis(int itemId, int id)
        {
            var success = await _itemStockAnalysisService.DeleteAsync(id);
            if (!success)
                return NotFound(new { message = "Stock analysis not found" });

            return NoContent();
        }

        // --- Item Specification Endpoints ---

        [HttpGet("{itemId}/specification")]
        public async Task<IActionResult> GetSpecificationByItemId(int itemId)
        {
            var specification = await _itemSpecificationService.GetByItemIdAsync(itemId);
            return Ok(specification);
        }

        [HttpPost("{itemId}/specification")]
        public async Task<IActionResult> CreateSpecification(int itemId, [FromBody] CreateItemSpecificationDto createDto)
        {
            var userId = CurrentUserId;
            if (userId <= 0)
                return Unauthorized(new { message = "Invalid user" });

            createDto.ItemId = itemId;
            var result = await _itemSpecificationService.CreateAsync(createDto, userId);
            return CreatedAtAction(nameof(GetSpecificationByItemId), new { itemId }, result);
        }

        [HttpPut("{itemId}/specification")]
        public async Task<IActionResult> UpdateSpecification(int itemId, [FromBody] UpdateItemSpecificationDto updateDto)
        {
            var userId = CurrentUserId;
            if (userId <= 0)
                return Unauthorized(new { message = "Invalid user" });

            var result = await _itemSpecificationService.UpdateAsync(itemId, updateDto, userId);
            return Ok(result);
        }

        [HttpDelete("{itemId}/specification")]
        public async Task<IActionResult> DeleteSpecification(int itemId)
        {
            var success = await _itemSpecificationService.DeleteAsync(itemId);
            if (!success)
                return NotFound(new { message = "Specification not found" });

            return NoContent();
        }

        // --- Item Bought Out Details Endpoints ---

        [HttpGet("{itemId}/bought-out-details")]
        public async Task<IActionResult> GetBoughtOutDetailsByItemId(int itemId)
        {
            var boughtOutDetails = await _itemBoughtOutDetailsService.GetByItemIdAsync(itemId);
            return Ok(boughtOutDetails);
        }

        [HttpGet("{itemId}/bought-out-details/{id}")]
        public async Task<IActionResult> GetBoughtOutDetailsById(int itemId, int id)
        {
            var boughtOutDetails = await _itemBoughtOutDetailsService.GetByIdAsync(id);
            if (boughtOutDetails == null || boughtOutDetails.ItemId != itemId)
                return NotFound();
            return Ok(boughtOutDetails);
        }

        [HttpPost("{itemId}/bought-out-details")]
        public async Task<IActionResult> CreateBoughtOutDetails(int itemId, [FromBody] CreateItemBoughtOutDetailsDto createDto)
        {
            var userId = CurrentUserId;
            if (userId <= 0)
                return Unauthorized(new { message = "Invalid user" });

            createDto.ItemId = itemId;
            var result = await _itemBoughtOutDetailsService.CreateAsync(createDto, userId);
            return CreatedAtAction(nameof(GetBoughtOutDetailsById), new { itemId, id = result.Id }, result);
        }

        [HttpPut("{itemId}/bought-out-details/{id}")]
        public async Task<IActionResult> UpdateBoughtOutDetails(int itemId, int id, [FromBody] UpdateItemBoughtOutDetailsDto updateDto)
        {
            var userId = CurrentUserId;
            if (userId <= 0)
                return Unauthorized(new { message = "Invalid user" });

            var result = await _itemBoughtOutDetailsService.UpdateAsync(id, updateDto, userId);
            return Ok(result);
        }

        [HttpDelete("{itemId}/bought-out-details/{id}")]
        public async Task<IActionResult> DeleteBoughtOutDetails(int itemId, int id)
        {
            var success = await _itemBoughtOutDetailsService.DeleteAsync(id);
            if (!success)
                return NotFound(new { message = "Bought out details not found" });

            return NoContent();
        }
    }
}
