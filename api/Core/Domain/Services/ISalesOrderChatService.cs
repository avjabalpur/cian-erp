using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.DTOs.SalesOrder;

namespace Xcianify.Core.Domain.Services
{
    public interface ISalesOrderChatService
    {
        Task<IEnumerable<SalesOrderChatDto>> GetAllChatMessagesAsync();
        Task<SalesOrderChatDto> GetChatMessageByIdAsync(int id);
        Task<SalesOrderChatDto> CreateChatMessageAsync(CreateSalesOrderChatDto chatDto);
        Task UpdateChatMessageAsync(int id, CreateSalesOrderChatDto chatDto);
        Task DeleteChatMessageAsync(int id);
        Task<IEnumerable<SalesOrderChatDto>> GetChatMessagesBySalesOrderAsync(int salesOrderId);
    }
} 