using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.DTOs.SalesOrder;

namespace Xcianify.Core.Domain.Services
{
    public interface ISalesOrderPerformaInvoiceItemService
    {
        Task<IEnumerable<SalesOrderPerformaInvoiceItemDto>> GetAllItemsAsync();
        Task<SalesOrderPerformaInvoiceItemDto> GetItemByIdAsync(int id);
        Task<SalesOrderPerformaInvoiceItemDto> CreateItemAsync(CreateSalesOrderPerformaInvoiceItemDto itemDto);
        Task UpdateItemAsync(int id, CreateSalesOrderPerformaInvoiceItemDto itemDto);
        Task DeleteItemAsync(int id);
        Task<IEnumerable<SalesOrderPerformaInvoiceItemDto>> GetItemsByPerformaInvoiceAsync(int performaInvoiceId);
        Task<IEnumerable<SalesOrderPerformaInvoiceItemDto>> GetItemsBySalesOrderAsync(int salesOrderId);
    }
} 