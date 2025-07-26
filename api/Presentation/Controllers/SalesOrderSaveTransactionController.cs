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
            try
            {
                var saveTransactions = await _saveTransactionService.GetAllSaveTransactionsAsync();
                return Ok(saveTransactions);
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
                var saveTransaction = await _saveTransactionService.GetSaveTransactionByIdAsync(id);
                return Ok(saveTransaction);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateSalesOrderSaveTransactionDto createSaveTransactionDto)
        {
            try
            {
                var createdSaveTransaction = await _saveTransactionService.CreateSaveTransactionAsync(createSaveTransactionDto);
                return CreatedAtAction(nameof(GetById), new { id = createdSaveTransaction.Id }, createdSaveTransaction);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateSalesOrderSaveTransactionDto updateSaveTransactionDto)
        {
            try
            {
                await _saveTransactionService.UpdateSaveTransactionAsync(id, updateSaveTransactionDto);
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
                await _saveTransactionService.DeleteSaveTransactionAsync(id);
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
                var saveTransactions = await _saveTransactionService.GetSaveTransactionsBySalesOrderAsync(salesOrderId);
                return Ok(saveTransactions);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
} 