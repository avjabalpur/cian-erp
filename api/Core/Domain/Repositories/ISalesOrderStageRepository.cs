using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.Model;

namespace Xcianify.Core.Domain.Repositories
{
    public interface ISalesOrderStageRepository
    {
        Task<IEnumerable<SalesOrderStage>> GetAllAsync();
        Task<SalesOrderStage> GetByIdAsync(int id);
        Task<SalesOrderStage> AddAsync(SalesOrderStage stage);
        Task<SalesOrderStage> UpdateAsync(SalesOrderStage stage);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<IEnumerable<SalesOrderStage>> GetBySalesOrderIdAsync(int salesOrderId);
        Task<SalesOrderStage> GetBySalesOrderIdAndStageNameAsync(int salesOrderId, string stageName);
    }
} 