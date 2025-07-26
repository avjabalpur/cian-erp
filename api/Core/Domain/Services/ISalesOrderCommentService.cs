using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.DTOs.SalesOrder;

namespace Xcianify.Core.Domain.Services
{
    public interface ISalesOrderCommentService
    {
        Task<IEnumerable<SalesOrderCommentDto>> GetAllCommentsAsync();
        Task<SalesOrderCommentDto> GetCommentByIdAsync(int id);
        Task<SalesOrderCommentDto> CreateCommentAsync(CreateSalesOrderCommentDto commentDto);
        Task UpdateCommentAsync(int id, CreateSalesOrderCommentDto commentDto);
        Task DeleteCommentAsync(int id);
        Task<IEnumerable<SalesOrderCommentDto>> GetCommentsBySalesOrderAsync(int salesOrderId);
        Task<IEnumerable<SalesOrderCommentDto>> GetCommentsByStatusAsync(string status);
        Task<IEnumerable<SalesOrderCommentDto>> GetCommentsByTypeAsync(string type);
    }
} 