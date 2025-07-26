using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.DTOs.SalesOrder;

namespace Xcianify.Core.Domain.Services
{
    public interface ISalesOrderSaveTransactionService
    {
        Task<IEnumerable<SalesOrderSaveTransactionDto>> GetAllSaveTransactionsAsync();
        Task<SalesOrderSaveTransactionDto> GetSaveTransactionByIdAsync(int id);
        Task<SalesOrderSaveTransactionDto> CreateSaveTransactionAsync(CreateSalesOrderSaveTransactionDto saveTransactionDto);
        Task UpdateSaveTransactionAsync(int id, CreateSalesOrderSaveTransactionDto saveTransactionDto);
        Task DeleteSaveTransactionAsync(int id);
        Task<IEnumerable<SalesOrderSaveTransactionDto>> GetSaveTransactionsBySalesOrderAsync(int salesOrderId);
    }
} 