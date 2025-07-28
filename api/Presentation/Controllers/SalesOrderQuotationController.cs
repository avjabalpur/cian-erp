using Microsoft.AspNetCore.Mvc;
using Xcianify.Core.DTOs.SalesOrder;
using Xcianify.Core.Domain.Services;

namespace Xcianify.Presentation.Controllers
{
    [ApiController]
    [Route("api/sales-order-quotation")]
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
            var quotations = await _quotationService.GetAllQuotationsAsync();
            return Ok(quotations);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var quotation = await _quotationService.GetQuotationByIdAsync(id);
            return Ok(quotation);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateSalesOrderQuotationDto createQuotationDto)
        {
            var createdQuotation = await _quotationService.CreateQuotationAsync(createQuotationDto);
            return CreatedAtAction(nameof(GetById), new { id = createdQuotation.Id }, createdQuotation);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateSalesOrderQuotationDto updateQuotationDto)
        {
            await _quotationService.UpdateQuotationAsync(id, updateQuotationDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _quotationService.DeleteQuotationAsync(id);
            return NoContent();
        }

        [HttpGet("number/{quotationNumber}")]
        public async Task<IActionResult> GetByQuotationNumber(string quotationNumber)
        {
            var quotation = await _quotationService.GetQuotationByNumberAsync(quotationNumber);
            return Ok(quotation);
        }

        [HttpGet("sales-order/{salesOrderId}")]
        public async Task<IActionResult> GetBySalesOrder(int salesOrderId)
        {
            var quotations = await _quotationService.GetQuotationByIdAsync(salesOrderId);
            return Ok(quotations);
        }

        // --- Sales Order Quotation Items Endpoints ---

        [HttpGet("{quotationId}/items")]
        public async Task<IActionResult> GetItems(int quotationId)
        {
            var items = await _quotationItemService.GetItemByIdAsync(quotationId);
            return Ok(items);
        }

        [HttpPost("{quotationId}/items")]
        public async Task<IActionResult> CreateItem(int quotationId, [FromBody] CreateSalesOrderQuotationItemDto createItemDto)
        {
            createItemDto.QuotationId = quotationId;
            var createdItem = await _quotationItemService.CreateItemAsync(createItemDto);
            return CreatedAtAction(nameof(GetItems), new { quotationId }, createdItem);
        }

        [HttpPut("{quotationId}/items/{itemId}")]
        public async Task<IActionResult> UpdateItem(int quotationId, int itemId, [FromBody] CreateSalesOrderQuotationItemDto updateItemDto)
        {
            updateItemDto.QuotationId = quotationId;
            await _quotationItemService.UpdateItemAsync(itemId, updateItemDto);
            return NoContent();
        }

        [HttpDelete("{quotationId}/items/{itemId}")]
        public async Task<IActionResult> DeleteItem(int quotationId, int itemId)
        {
            await _quotationItemService.DeleteItemAsync(itemId);
            return NoContent();
        }
    }
} 