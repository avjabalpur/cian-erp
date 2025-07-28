using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.DTOs.SalesOrder;

namespace Xcianify.Core.Domain.Services
{
    public interface ISalesOrderQuotationItemService
    {
        Task<IEnumerable<SalesOrderQuotationItemDto>> GetAllItemsAsync();
        Task<SalesOrderQuotationItemDto> GetItemByIdAsync(int id);
        Task<SalesOrderQuotationItemDto> CreateItemAsync(CreateSalesOrderQuotationItemDto quotationItemDto);
        Task UpdateItemAsync(int id, CreateSalesOrderQuotationItemDto quotationItemDto);
        Task DeleteItemAsync(int id);
        Task<IEnumerable<SalesOrderQuotationItemDto>> GetItemsByQuotationAsync(int quotationId);
        Task<IEnumerable<SalesOrderQuotationItemDto>> GetItemsBySalesOrderAsync(int salesOrderId);
    }
} 