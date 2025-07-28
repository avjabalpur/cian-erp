using Microsoft.AspNetCore.Mvc;
using Xcianify.Core.DTOs.SalesOrder;
using Xcianify.Core.Domain.Services;

namespace Xcianify.Presentation.Controllers
{
    [ApiController]
    [Route("api/sales-order-transaction")]
    public class SalesOrderSaveTransactionController : BaseApiController
    {
        private readonly ISalesOrderSaveTransactionService _saveTransactionService;

        public SalesOrderSaveTransactionController(ISalesOrderSaveTransactionService saveTransactionService)
        {
            _saveTransactionService = saveTransactionService ?? throw new ArgumentNullException(nameof(saveTransactionService));
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var saveTransactions = await _saveTransactionService.GetAllSaveTransactionsAsync();
            return Ok(saveTransactions);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var saveTransaction = await _saveTransactionService.GetSaveTransactionByIdAsync(id);
            return Ok(saveTransaction);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateSalesOrderSaveTransactionDto createSaveTransactionDto)
        {
            var createdSaveTransaction = await _saveTransactionService.CreateSaveTransactionAsync(createSaveTransactionDto);
            return CreatedAtAction(nameof(GetById), new { id = createdSaveTransaction.Id }, createdSaveTransaction);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateSalesOrderSaveTransactionDto updateSaveTransactionDto)
        {
            await _saveTransactionService.UpdateSaveTransactionAsync(id, updateSaveTransactionDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _saveTransactionService.DeleteSaveTransactionAsync(id);
            return NoContent();
        }

        [HttpGet("sales-order/{salesOrderId}")]
        public async Task<IActionResult> GetBySalesOrder(int salesOrderId)
        {
            var saveTransactions = await _saveTransactionService.GetSaveTransactionsBySalesOrderAsync(salesOrderId);
            return Ok(saveTransactions);
        }
    }
} 