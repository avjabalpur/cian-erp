using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs.SalesOrder;

namespace Xcianify.Presentation.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SalesOrderQuotationController : BaseApiController
    {
        private readonly ISalesOrderQuotationService _quotationService;
        private readonly ISalesOrderQuotationItemService _quotationItemService;

        public SalesOrderQuotationController(
            ISalesOrderQuotationService quotationService,
            ISalesOrderQuotationItemService quotationItemService)
        {
            _quotationService = quotationService ?? throw new ArgumentNullException(nameof(quotationService));
            _quotationItemService = quotationItemService ?? throw new ArgumentNullException(nameof(quotationItemService));
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var quotations = await _quotationService.GetAllQuotationsAsync();
                return Ok(quotations);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var quotation = await _quotationService.GetQuotationByIdAsync(id);
                return Ok(quotation);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet("number/{quotationNumber}")]
        public async Task<IActionResult> GetByQuotationNumber(string quotationNumber)
        {
            try
            {
                var quotation = await _quotationService.GetQuotationByNumberAsync(quotationNumber);
                return Ok(quotation);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateSalesOrderQuotationDto createQuotationDto)
        {
            try
            {
                var createdQuotation = await _quotationService.CreateQuotationAsync(createQuotationDto);
                return CreatedAtAction(nameof(GetById), new { id = createdQuotation.Id }, createdQuotation);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateSalesOrderQuotationDto updateQuotationDto)
        {
            try
            {
                await _quotationService.UpdateQuotationAsync(id, updateQuotationDto);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _quotationService.DeleteQuotationAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetByCustomer(int customerId)
        {
            try
            {
                var quotations = await _quotationService.GetQuotationsByCustomerAsync(customerId);
                return Ok(quotations);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet("organization/{organizationId}")]
        public async Task<IActionResult> GetByOrganization(int organizationId)
        {
            try
            {
                var quotations = await _quotationService.GetQuotationsByOrganizationAsync(organizationId);
                return Ok(quotations);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet("date-range")]
        public async Task<IActionResult> GetByDateRange([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            try
            {
                var quotations = await _quotationService.GetQuotationsByDateRangeAsync(startDate, endDate);
                return Ok(quotations);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        // --- Sales Order Quotation Items Endpoints ---

        [HttpGet("{quotationId}/items")]
        public async Task<IActionResult> GetItems(int quotationId)
        {
            try
            {
                var items = await _quotationItemService.GetQuotationItemsByQuotationAsync(quotationId);
                return Ok(items);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPost("{quotationId}/items")]
        public async Task<IActionResult> CreateItem(int quotationId, [FromBody] CreateSalesOrderQuotationItemDto createItemDto)
        {
            try
            {
                createItemDto.QuotationId = quotationId;
                var createdItem = await _quotationItemService.CreateQuotationItemAsync(createItemDto);
                return CreatedAtAction(nameof(GetItems), new { quotationId }, createdItem);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPut("{quotationId}/items/{itemId}")]
        public async Task<IActionResult> UpdateItem(int quotationId, int itemId, [FromBody] CreateSalesOrderQuotationItemDto updateItemDto)
        {
            try
            {
                updateItemDto.QuotationId = quotationId;
                await _quotationItemService.UpdateQuotationItemAsync(itemId, updateItemDto);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpDelete("{quotationId}/items/{itemId}")]
        public async Task<IActionResult> DeleteItem(int quotationId, int itemId)
        {
            try
            {
                await _quotationItemService.DeleteQuotationItemAsync(itemId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
} 