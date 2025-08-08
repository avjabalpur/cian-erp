using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.DTOs.SalesOrder;

namespace Xcianify.Core.Domain.Services
{
    public interface ISalesOrderService
    {
        Task<(IEnumerable<SalesOrderDto> Items, int TotalCount)> GetAllAsync(SalesOrderFilterDto filterDto);
        Task<SalesOrderDto> GetByIdAsync(int id);
        Task<SalesOrderDto> GetBySoNumberAsync(string soNumber);
        Task<SalesOrderDto> CreateAsync(CreateSalesOrderDto salesOrderDto);
        Task UpdateAsync(UpdateSalesOrderDto salesOrderDto);
        Task DeleteAsync(int id);
        Task<string> GenerateSoNumberAsync();
        Task<bool> SubmitAsync(int id);
        Task<bool> ApproveAsync(int id);
        Task<bool> RejectAsync(int id);
        Task<int> CreateApprovalAsync(CreateSalesOrderApprovalDto approvalDto, int currentUserId);
    }
} 