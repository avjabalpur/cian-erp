using Microsoft.AspNetCore.Mvc;
using Xcianify.Core.DTOs.SalesOrder;
using Xcianify.Core.Domain.Services;

namespace Xcianify.Presentation.Controllers
{
    [ApiController]
    [Route("api/sales-order-performa-invoice")]
    public class SalesOrderPerformaInvoiceController : BaseApiController
    {
        private readonly ISalesOrderPerformaInvoiceService _performaInvoiceService;
        private readonly ISalesOrderPerformaInvoiceItemService _performaInvoiceItemService;

        public SalesOrderPerformaInvoiceController(
            ISalesOrderPerformaInvoiceService performaInvoiceService,
            ISalesOrderPerformaInvoiceItemService performaInvoiceItemService)
        {
            _performaInvoiceService = performaInvoiceService ?? throw new ArgumentNullException(nameof(performaInvoiceService));
            _performaInvoiceItemService = performaInvoiceItemService ?? throw new ArgumentNullException(nameof(performaInvoiceItemService));
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var performaInvoices = await _performaInvoiceService.GetAllPerformaInvoicesAsync();
            return Ok(performaInvoices);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var performaInvoice = await _performaInvoiceService.GetPerformaInvoiceByIdAsync(id);
            return Ok(performaInvoice);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateSalesOrderPerformaInvoiceDto createPerformaInvoiceDto)
        {
            var createdPerformaInvoice = await _performaInvoiceService.CreatePerformaInvoiceAsync(createPerformaInvoiceDto);
            return CreatedAtAction(nameof(GetById), new { id = createdPerformaInvoice.Id }, createdPerformaInvoice);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateSalesOrderPerformaInvoiceDto updatePerformaInvoiceDto)
        {
            await _performaInvoiceService.UpdatePerformaInvoiceAsync(id, updatePerformaInvoiceDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _performaInvoiceService.DeletePerformaInvoiceAsync(id);
            return NoContent();
        }

        [HttpGet("number/{performaInvoiceNumber}")]
        public async Task<IActionResult> GetByPerformaInvoiceNumber(string performaInvoiceNumber)
        {
            var performaInvoice = await _performaInvoiceService.GetPerformaInvoiceByNumberAsync(performaInvoiceNumber);
            return Ok(performaInvoice);
        }

        [HttpGet("sales-order/{salesOrderId}")]
        public async Task<IActionResult> GetBySalesOrder(int salesOrderId)
        {
            var performaInvoices = await _performaInvoiceService.GetPerformaInvoicesBySalesOrderAsync(salesOrderId);
            return Ok(performaInvoices);
        }

        // --- Sales Order Performa Invoice Items Endpoints ---

        [HttpGet("{performaInvoiceId}/items")]
        public async Task<IActionResult> GetItems(int performaInvoiceId)
        {
            var items = await _performaInvoiceItemService.GetItemsByPerformaInvoiceAsync(performaInvoiceId);
            return Ok(items);
        }

        [HttpPost("{performaInvoiceId}/items")]
        public async Task<IActionResult> CreateItem(int performaInvoiceId, [FromBody] CreateSalesOrderPerformaInvoiceItemDto createItemDto)
        {
            createItemDto.PerformaInvoiceId = performaInvoiceId;
            var createdItem = await _performaInvoiceItemService.CreateItemAsync(createItemDto);
            return CreatedAtAction(nameof(GetItems), new { performaInvoiceId }, createdItem);
        }

        [HttpPut("{performaInvoiceId}/items/{itemId}")]
        public async Task<IActionResult> UpdateItem(int performaInvoiceId, int itemId, [FromBody] CreateSalesOrderPerformaInvoiceItemDto updateItemDto)
        {
            updateItemDto.PerformaInvoiceId = performaInvoiceId;
            await _performaInvoiceItemService.UpdateItemAsync(itemId, updateItemDto);
            return NoContent();
        }

        [HttpDelete("{performaInvoiceId}/items/{itemId}")]
        public async Task<IActionResult> DeleteItem(int performaInvoiceId, int itemId)
        {
            await _performaInvoiceItemService.DeleteItemAsync(itemId);
            return NoContent();
        }
    }
} 