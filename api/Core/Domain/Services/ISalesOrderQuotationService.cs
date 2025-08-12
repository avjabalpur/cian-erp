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
        Task<IEnumerable<SalesOrderQuotationDto>> GetQuotationsByCustomerAsync(string customerName);
        Task<IEnumerable<SalesOrderQuotationDto>> GetQuotationsByCompanyAsync(string companyName);
        Task<IEnumerable<SalesOrderQuotationDto>> GetQuotationsByDateRangeAsync(DateTime startDate, DateTime endDate);
    }
} 