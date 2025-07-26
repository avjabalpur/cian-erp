using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.DTOs.SalesOrder;

namespace Xcianify.Core.Domain.Services
{
    public interface ISalesOrderService
    {
        Task<(IEnumerable<SalesOrderDto> Items, int TotalCount)> GetAllSalesOrdersAsync(SalesOrderFilterDto filterDto);
        Task<SalesOrderDto> GetSalesOrderByIdAsync(int id);
        Task<SalesOrderDto> GetSalesOrderBySoNumberAsync(string soNumber);
        Task<SalesOrderDto> CreateSalesOrderAsync(CreateSalesOrderDto salesOrderDto);
        Task UpdateSalesOrderAsync(UpdateSalesOrderDto salesOrderDto);
        Task DeleteSalesOrderAsync(int id);
        Task<IEnumerable<SalesOrderDto>> GetSalesOrdersByCustomerAsync(int customerId);
        Task<IEnumerable<SalesOrderDto>> GetSalesOrdersByOrganizationAsync(int organizationId);
        Task<IEnumerable<SalesOrderDto>> GetSalesOrdersByStatusAsync(string status);
        Task<string> GenerateSoNumberAsync();
        Task<bool> SubmitSalesOrderAsync(int id);
        Task<bool> ApproveSalesOrderAsync(int id);
        Task<bool> RejectSalesOrderAsync(int id);
    }
} 