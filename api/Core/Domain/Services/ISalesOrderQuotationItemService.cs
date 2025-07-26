using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.DTOs.SalesOrder;

namespace Xcianify.Core.Domain.Services
{
    public interface ISalesOrderQuotationItemService
    {
        Task<IEnumerable<SalesOrderQuotationItemDto>> GetAllQuotationItemsAsync();
        Task<SalesOrderQuotationItemDto> GetQuotationItemByIdAsync(int id);
        Task<SalesOrderQuotationItemDto> CreateQuotationItemAsync(CreateSalesOrderQuotationItemDto quotationItemDto);
        Task UpdateQuotationItemAsync(int id, CreateSalesOrderQuotationItemDto quotationItemDto);
        Task DeleteQuotationItemAsync(int id);
        Task<IEnumerable<SalesOrderQuotationItemDto>> GetQuotationItemsByQuotationAsync(int quotationId);
        Task<IEnumerable<SalesOrderQuotationItemDto>> GetQuotationItemsBySalesOrderAsync(int salesOrderId);
    }
} 