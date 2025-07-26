using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.DTOs.SalesOrder;

namespace Xcianify.Core.Domain.Services
{
    public interface ISalesOrderPerformaInvoiceService
    {
        Task<IEnumerable<SalesOrderPerformaInvoiceDto>> GetAllPerformaInvoicesAsync();
        Task<SalesOrderPerformaInvoiceDto> GetPerformaInvoiceByIdAsync(int id);
        Task<SalesOrderPerformaInvoiceDto> GetPerformaInvoiceByNumberAsync(string invoiceNumber);
        Task<SalesOrderPerformaInvoiceDto> CreatePerformaInvoiceAsync(CreateSalesOrderPerformaInvoiceDto performaInvoiceDto);
        Task UpdatePerformaInvoiceAsync(int id, CreateSalesOrderPerformaInvoiceDto performaInvoiceDto);
        Task DeletePerformaInvoiceAsync(int id);
        Task<IEnumerable<SalesOrderPerformaInvoiceDto>> GetPerformaInvoicesBySalesOrderAsync(int salesOrderId);
    }
} 