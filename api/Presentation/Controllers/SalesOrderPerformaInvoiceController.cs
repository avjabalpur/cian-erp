using Microsoft.AspNetCore.Mvc;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs.SalesOrder;

namespace Xcianify.Presentation.Controllers
{
    [Route("api/[controller]")]
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
            try
            {
                var performaInvoices = await _performaInvoiceService.GetAllPerformaInvoicesAsync();
                return Ok(performaInvoices);
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
                var performaInvoice = await _performaInvoiceService.GetPerformaInvoiceByIdAsync(id);
                return Ok(performaInvoice);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet("number/{invoiceNumber}")]
        public async Task<IActionResult> GetByInvoiceNumber(string invoiceNumber)
        {
            try
            {
                var performaInvoice = await _performaInvoiceService.GetPerformaInvoiceByNumberAsync(invoiceNumber);
                return Ok(performaInvoice);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateSalesOrderPerformaInvoiceDto createPerformaInvoiceDto)
        {
            try
            {
                var createdPerformaInvoice = await _performaInvoiceService.CreatePerformaInvoiceAsync(createPerformaInvoiceDto);
                return CreatedAtAction(nameof(GetById), new { id = createdPerformaInvoice.Id }, createdPerformaInvoice);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateSalesOrderPerformaInvoiceDto updatePerformaInvoiceDto)
        {
            try
            {
                await _performaInvoiceService.UpdatePerformaInvoiceAsync(id, updatePerformaInvoiceDto);
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
                await _performaInvoiceService.DeletePerformaInvoiceAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet("sales-order/{salesOrderId}")]
        public async Task<IActionResult> GetBySalesOrder(int salesOrderId)
        {
            try
            {
                var performaInvoices = await _performaInvoiceService.GetPerformaInvoicesBySalesOrderAsync(salesOrderId);
                return Ok(performaInvoices);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        // --- Sales Order Performa Invoice Items Endpoints ---

        [HttpGet("{performaInvoiceId}/items")]
        public async Task<IActionResult> GetItems(int performaInvoiceId)
        {
            try
            {
                var items = await _performaInvoiceItemService.GetPerformaInvoiceItemsByPerformaInvoiceAsync(performaInvoiceId);
                return Ok(items);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPost("{performaInvoiceId}/items")]
        public async Task<IActionResult> CreateItem(int performaInvoiceId, [FromBody] CreateSalesOrderPerformaInvoiceItemDto createItemDto)
        {
            try
            {
                createItemDto.PerformaInvoiceId = performaInvoiceId;
                var createdItem = await _performaInvoiceItemService.CreatePerformaInvoiceItemAsync(createItemDto);
                return CreatedAtAction(nameof(GetItems), new { performaInvoiceId }, createdItem);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPut("{performaInvoiceId}/items/{itemId}")]
        public async Task<IActionResult> UpdateItem(int performaInvoiceId, int itemId, [FromBody] CreateSalesOrderPerformaInvoiceItemDto updateItemDto)
        {
            try
            {
                updateItemDto.PerformaInvoiceId = performaInvoiceId;
                await _performaInvoiceItemService.UpdatePerformaInvoiceItemAsync(itemId, updateItemDto);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpDelete("{performaInvoiceId}/items/{itemId}")]
        public async Task<IActionResult> DeleteItem(int performaInvoiceId, int itemId)
        {
            try
            {
                await _performaInvoiceItemService.DeletePerformaInvoiceItemAsync(itemId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
} 