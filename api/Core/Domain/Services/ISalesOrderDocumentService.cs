using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.DTOs.SalesOrder;

namespace Xcianify.Core.Domain.Services
{
    public interface ISalesOrderDocumentService
    {
        Task<IEnumerable<SalesOrderDocumentDto>> GetAllDocumentsAsync();
        Task<SalesOrderDocumentDto> GetDocumentByIdAsync(int id);
        Task<SalesOrderDocumentDto> CreateDocumentAsync(CreateSalesOrderDocumentDto documentDto);
        Task UpdateDocumentAsync(int id, CreateSalesOrderDocumentDto documentDto);
        Task DeleteDocumentAsync(int id);
        Task<IEnumerable<SalesOrderDocumentDto>> GetDocumentsBySalesOrderAsync(int salesOrderId);
        Task<IEnumerable<SalesOrderDocumentDto>> GetDocumentsByTagAsync(string tag);
        Task<IEnumerable<SalesOrderDocumentDto>> GetDocumentsByFileTypeAsync(string fileType);
    }
} 