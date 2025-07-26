using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.Model;

namespace Xcianify.Core.Domain.Repositories
{
    public interface ISalesOrderPerformaInvoiceRepository
    {
        Task<IEnumerable<SalesOrderPerformaInvoice>> GetAllAsync();
        Task<SalesOrderPerformaInvoice> GetByIdAsync(int id);
        Task<SalesOrderPerformaInvoice> GetByInvoiceNumberAsync(string invoiceNumber);
        Task<SalesOrderPerformaInvoice> AddAsync(SalesOrderPerformaInvoice performaInvoice);
        Task<SalesOrderPerformaInvoice> UpdateAsync(SalesOrderPerformaInvoice performaInvoice);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<bool> InvoiceNumberExistsAsync(string invoiceNumber, int? excludeId = null);
        Task<IEnumerable<SalesOrderPerformaInvoice>> GetBySalesOrderIdAsync(int salesOrderId);
    }
} 