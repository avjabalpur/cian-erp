using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.Model;

namespace Xcianify.Core.Domain.Repositories
{
    public interface ISalesOrderDocumentRepository
    {
        Task<IEnumerable<SalesOrderDocument>> GetAllAsync();
        Task<SalesOrderDocument> GetByIdAsync(int id);
        Task<SalesOrderDocument> AddAsync(SalesOrderDocument document);
        Task<SalesOrderDocument> UpdateAsync(SalesOrderDocument document);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<IEnumerable<SalesOrderDocument>> GetBySalesOrderIdAsync(int salesOrderId);
        Task<IEnumerable<SalesOrderDocument>> GetByTagAsync(string tag);
        Task<IEnumerable<SalesOrderDocument>> GetByFileTypeAsync(string fileType);
    }
} 