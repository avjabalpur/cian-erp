using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.Model;

namespace Xcianify.Core.Domain.Repositories
{
    public interface ISalesOrderQuotationRepository
    {
        Task<IEnumerable<SalesOrderQuotation>> GetAllAsync();
        Task<SalesOrderQuotation> GetByIdAsync(int id);
        Task<SalesOrderQuotation> GetByQuotationNumberAsync(string quotationNumber);
        Task<SalesOrderQuotation> AddAsync(SalesOrderQuotation quotation);
        Task<SalesOrderQuotation> UpdateAsync(SalesOrderQuotation quotation);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<bool> QuotationNumberExistsAsync(string quotationNumber, int? excludeId = null);
        Task<IEnumerable<SalesOrderQuotation>> GetByCustomerIdAsync(int customerId);
        Task<IEnumerable<SalesOrderQuotation>> GetByOrganizationIdAsync(int organizationId);
        Task<IEnumerable<SalesOrderQuotation>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
    }
} 