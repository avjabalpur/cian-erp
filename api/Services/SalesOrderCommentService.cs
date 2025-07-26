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
    public class SalesOrderCommentService : ISalesOrderCommentService
    {
        private readonly ISalesOrderCommentRepository _commentRepository;
        private readonly IMapper _mapper;

        public SalesOrderCommentService(
            ISalesOrderCommentRepository commentRepository,
            IMapper mapper)
        {
            _commentRepository = commentRepository ?? throw new ArgumentNullException(nameof(commentRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<IEnumerable<SalesOrderCommentDto>> GetAllCommentsAsync()
        {
            var comments = await _commentRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<SalesOrderCommentDto>>(comments);
        }

        public async Task<SalesOrderCommentDto> GetCommentByIdAsync(int id)
        {
            var comment = await _commentRepository.GetByIdAsync(id);
            if (comment == null)
                throw new NotFoundException("Comment not found");

            return _mapper.Map<SalesOrderCommentDto>(comment);
        }

        public async Task<SalesOrderCommentDto> CreateCommentAsync(CreateSalesOrderCommentDto commentDto)
        {
            var comment = _mapper.Map<SalesOrderComment>(commentDto);
            comment.CreatedAt = DateTime.UtcNow;
            comment.UpdatedAt = DateTime.UtcNow;
            comment.IsDeleted = false;

            var createdComment = await _commentRepository.AddAsync(comment);
            return _mapper.Map<SalesOrderCommentDto>(createdComment);
        }

        public async Task UpdateCommentAsync(int id, CreateSalesOrderCommentDto commentDto)
        {
            var existingComment = await _commentRepository.GetByIdAsync(id);
            if (existingComment == null)
                throw new NotFoundException("Comment not found");

            _mapper.Map(commentDto, existingComment);
            existingComment.UpdatedAt = DateTime.UtcNow;

            await _commentRepository.UpdateAsync(existingComment);
        }

        public async Task DeleteCommentAsync(int id)
        {
            var comment = await _commentRepository.GetByIdAsync(id);
            if (comment == null)
                throw new NotFoundException("Comment not found");

            await _commentRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<SalesOrderCommentDto>> GetCommentsBySalesOrderAsync(int salesOrderId)
        {
            var comments = await _commentRepository.GetBySalesOrderIdAsync(salesOrderId);
            return _mapper.Map<IEnumerable<SalesOrderCommentDto>>(comments);
        }

        public async Task<IEnumerable<SalesOrderCommentDto>> GetCommentsByStatusAsync(string status)
        {
            var comments = await _commentRepository.GetByStatusAsync(status);
            return _mapper.Map<IEnumerable<SalesOrderCommentDto>>(comments);
        }

        public async Task<IEnumerable<SalesOrderCommentDto>> GetCommentsByTypeAsync(string type)
        {
            var comments = await _commentRepository.GetByTypeAsync(type);
            return _mapper.Map<IEnumerable<SalesOrderCommentDto>>(comments);
        }
    }
} 