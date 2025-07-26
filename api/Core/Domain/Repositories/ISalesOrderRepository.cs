using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.DTOs.SalesOrder;
using Xcianify.Core.Model;

namespace Xcianify.Core.Domain.Repositories
{
    public interface ISalesOrderRepository
    {
        Task<(IEnumerable<SalesOrder> Items, int TotalCount)> GetAllAsync(SalesOrderFilterDto filterDto);
        Task<SalesOrder> GetByIdAsync(int id);
        Task<SalesOrder> GetBySoNumberAsync(string soNumber);
        Task<SalesOrder> AddAsync(SalesOrder salesOrder);
        Task<SalesOrder> UpdateAsync(SalesOrder salesOrder);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<bool> SoNumberExistsAsync(string soNumber, int? excludeId = null);
        Task<IEnumerable<SalesOrder>> GetByCustomerIdAsync(int customerId);
        Task<IEnumerable<SalesOrder>> GetByOrganizationIdAsync(int organizationId);
        Task<IEnumerable<SalesOrder>> GetByStatusAsync(string status);
        Task<int> GetNextSoNumberAsync();
    }
} 