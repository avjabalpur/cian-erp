using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.Model;

namespace Xcianify.Core.Domain.Repositories
{
    public interface ISalesOrderQuotationItemRepository
    {
        Task<IEnumerable<SalesOrderQuotationItem>> GetAllAsync();
        Task<SalesOrderQuotationItem> GetByIdAsync(int id);
        Task<SalesOrderQuotationItem> AddAsync(SalesOrderQuotationItem quotationItem);
        Task<SalesOrderQuotationItem> UpdateAsync(SalesOrderQuotationItem quotationItem);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<IEnumerable<SalesOrderQuotationItem>> GetByQuotationIdAsync(int quotationId);
        Task<IEnumerable<SalesOrderQuotationItem>> GetBySalesOrderIdAsync(int salesOrderId);
    }
} 