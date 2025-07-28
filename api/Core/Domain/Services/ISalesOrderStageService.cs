using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.DTOs.SalesOrder;

namespace Xcianify.Core.Domain.Services
{
    public interface ISalesOrderStageService
    {
        Task<IEnumerable<SalesOrderStageDto>> GetAllStagesAsync();
        Task<SalesOrderStageDto> GetStageByIdAsync(int id);
        Task<SalesOrderStageDto> CreateStageAsync(CreateSalesOrderStageDto stageDto);
        Task UpdateStageAsync(int id, CreateSalesOrderStageDto stageDto);
        Task DeleteStageAsync(int id);
        Task<IEnumerable<SalesOrderStageDto>> GetStagesBySalesOrderAsync(int salesOrderId);
        Task<SalesOrderStageDto> GetStageBySalesOrderAndNameAsync(int salesOrderId, string stageName);
        Task<bool> ApproveStageAsync(int salesOrderId, string stageName);
        Task<bool> RejectStageAsync(int salesOrderId, string stageName);
    }
} 