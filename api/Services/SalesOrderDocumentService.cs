using AutoMapper;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs.SalesOrder;
using Xcianify.Core.Model;
using Xcianify.Core.Exceptions;

namespace Xcianify.Services
{
    public class SalesOrderDocumentService : ISalesOrderDocumentService
    {
        private readonly ISalesOrderDocumentRepository _documentRepository;
        private readonly IMapper _mapper;

        public SalesOrderDocumentService(
            ISalesOrderDocumentRepository documentRepository,
            IMapper mapper)
        {
            _documentRepository = documentRepository ?? throw new ArgumentNullException(nameof(documentRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<IEnumerable<SalesOrderDocumentDto>> GetAllDocumentsAsync()
        {
            var documents = await _documentRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<SalesOrderDocumentDto>>(documents);
        }

        public async Task<SalesOrderDocumentDto> GetDocumentByIdAsync(int id)
        {
            var document = await _documentRepository.GetByIdAsync(id);
            if (document == null)
                throw new NotFoundException("Document not found");

            return _mapper.Map<SalesOrderDocumentDto>(document);
        }

        public async Task<SalesOrderDocumentDto> CreateDocumentAsync(CreateSalesOrderDocumentDto documentDto)
        {
            var document = _mapper.Map<SalesOrderDocument>(documentDto);
            document.CreatedAt = DateTime.UtcNow;
            document.UpdatedAt = DateTime.UtcNow;

            var createdDocument = await _documentRepository.AddAsync(document);
            return _mapper.Map<SalesOrderDocumentDto>(createdDocument);
        }

        public async Task UpdateDocumentAsync(int id, CreateSalesOrderDocumentDto documentDto)
        {
            var existingDocument = await _documentRepository.GetByIdAsync(id);
            if (existingDocument == null)
                throw new NotFoundException("Document not found");

            _mapper.Map(documentDto, existingDocument);
            existingDocument.UpdatedAt = DateTime.UtcNow;

            await _documentRepository.UpdateAsync(existingDocument);
        }

        public async Task DeleteDocumentAsync(int id)
        {
            var document = await _documentRepository.GetByIdAsync(id);
            if (document == null)
                throw new NotFoundException("Document not found");

            await _documentRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<SalesOrderDocumentDto>> GetDocumentsBySalesOrderAsync(int salesOrderId)
        {
            var documents = await _documentRepository.GetBySalesOrderIdAsync(salesOrderId);
            return _mapper.Map<IEnumerable<SalesOrderDocumentDto>>(documents);
        }

        public async Task<IEnumerable<SalesOrderDocumentDto>> GetDocumentsByTagAsync(string tag)
        {
            var documents = await _documentRepository.GetByTagAsync(tag);
            return _mapper.Map<IEnumerable<SalesOrderDocumentDto>>(documents);
        }

        public async Task<IEnumerable<SalesOrderDocumentDto>> GetDocumentsByFileTypeAsync(string fileType)
        {
            var documents = await _documentRepository.GetByFileTypeAsync(fileType);
            return _mapper.Map<IEnumerable<SalesOrderDocumentDto>>(documents);
        }
    }
} 