using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.Model;
using Xcianify.Core.DTOs.SalesOrder;

namespace Xcianify.Core.Domain.Repositories
{
    public interface ISalesOrderQuotationRepository
    {
        Task<(IEnumerable<SalesOrderQuotation> Items, int TotalCount)> GetAllAsync(QuotationFilterDto filterDto);
        Task<SalesOrderQuotation> GetByIdAsync(int id);
        Task<SalesOrderQuotation> GetByQuotationNumberAsync(string quotationNumber);
        Task<SalesOrderQuotation> AddAsync(SalesOrderQuotation quotation);
        Task<SalesOrderQuotation> UpdateAsync(SalesOrderQuotation quotation);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<bool> QuotationNumberExistsAsync(string quotationNumber, int? excludeId = null);
    }
} 