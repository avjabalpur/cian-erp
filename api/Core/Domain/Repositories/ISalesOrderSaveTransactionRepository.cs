using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.Model;

namespace Xcianify.Core.Domain.Repositories
{
    public interface ISalesOrderSaveTransactionRepository
    {
        Task<IEnumerable<SalesOrderSaveTransaction>> GetAllAsync();
        Task<SalesOrderSaveTransaction> GetByIdAsync(int id);
        Task<SalesOrderSaveTransaction> AddAsync(SalesOrderSaveTransaction saveTransaction);
        Task<SalesOrderSaveTransaction> UpdateAsync(SalesOrderSaveTransaction saveTransaction);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<IEnumerable<SalesOrderSaveTransaction>> GetBySalesOrderIdAsync(int salesOrderId);
    }
} 