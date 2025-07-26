using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.Model;

namespace Xcianify.Core.Domain.Repositories
{
    public interface ISalesOrderCommentRepository
    {
        Task<IEnumerable<SalesOrderComment>> GetAllAsync();
        Task<SalesOrderComment> GetByIdAsync(int id);
        Task<SalesOrderComment> AddAsync(SalesOrderComment comment);
        Task<SalesOrderComment> UpdateAsync(SalesOrderComment comment);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<IEnumerable<SalesOrderComment>> GetBySalesOrderIdAsync(int salesOrderId);
        Task<IEnumerable<SalesOrderComment>> GetByStatusAsync(string status);
        Task<IEnumerable<SalesOrderComment>> GetByTypeAsync(string type);
    }
} 