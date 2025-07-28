using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.Model;

namespace Xcianify.Core.Domain.Repositories
{
    public interface ISalesOrderPerformaInvoiceItemRepository
    {
        Task<IEnumerable<SalesOrderPerformaInvoiceItem>> GetAllAsync();
        Task<SalesOrderPerformaInvoiceItem> GetByIdAsync(int id);
        Task<SalesOrderPerformaInvoiceItem> AddAsync(SalesOrderPerformaInvoiceItem item);
        Task<SalesOrderPerformaInvoiceItem> UpdateAsync(SalesOrderPerformaInvoiceItem item);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<IEnumerable<SalesOrderPerformaInvoiceItem>> GetByPerformaInvoiceIdAsync(int performaInvoiceId);
        Task<IEnumerable<SalesOrderPerformaInvoiceItem>> GetBySalesOrderIdAsync(int salesOrderId);
    }
} 