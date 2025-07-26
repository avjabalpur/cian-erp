using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.Model;

namespace Xcianify.Core.Domain.Repositories
{
    public interface ISalesOrderChatRepository
    {
        Task<IEnumerable<SalesOrderChat>> GetAllAsync();
        Task<SalesOrderChat> GetByIdAsync(int id);
        Task<SalesOrderChat> AddAsync(SalesOrderChat chat);
        Task<SalesOrderChat> UpdateAsync(SalesOrderChat chat);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<IEnumerable<SalesOrderChat>> GetBySalesOrderIdAsync(int salesOrderId);
    }
} 