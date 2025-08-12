using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.DTOs.SalesOrder;

namespace Xcianify.Core.Domain.Services
{
    public interface ISalesOrderQuotationService
    {
        Task<(IEnumerable<SalesOrderQuotationDto> Items, int TotalCount)> GetAllAsync(QuotationFilterDto filterDto);
        Task<SalesOrderQuotationDto> GetQuotationByIdAsync(int id);
        Task<SalesOrderQuotationDto> GetQuotationByNumberAsync(string quotationNumber);
        Task<SalesOrderQuotationDto> CreateQuotationAsync(CreateSalesOrderQuotationDto quotationDto);
        Task UpdateQuotationAsync(int id, CreateSalesOrderQuotationDto quotationDto);
        Task DeleteQuotationAsync(int id);
    }
} 