using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.DTOs.SalesOrder;

namespace Xcianify.Core.Domain.Services
{
    public interface ISalesOrderQuotationService
    {
        Task<IEnumerable<SalesOrderQuotationDto>> GetAllQuotationsAsync();
        Task<SalesOrderQuotationDto> GetQuotationByIdAsync(int id);
        Task<SalesOrderQuotationDto> GetQuotationByNumberAsync(string quotationNumber);
        Task<SalesOrderQuotationDto> CreateQuotationAsync(CreateSalesOrderQuotationDto quotationDto);
        Task UpdateQuotationAsync(int id, CreateSalesOrderQuotationDto quotationDto);
        Task DeleteQuotationAsync(int id);
        Task<IEnumerable<SalesOrderQuotationDto>> GetQuotationsByCustomerAsync(int customerId);
        Task<IEnumerable<SalesOrderQuotationDto>> GetQuotationsByOrganizationAsync(int organizationId);
        Task<IEnumerable<SalesOrderQuotationDto>> GetQuotationsByDateRangeAsync(DateTime startDate, DateTime endDate);
    }
} 