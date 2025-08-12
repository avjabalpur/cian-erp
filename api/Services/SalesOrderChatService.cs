using AutoMapper;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs.SalesOrder;
using Xcianify.Core.Model;
using Xcianify.Core.Exceptions;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Xcianify.Services
{
    public class SalesOrderChatService : ISalesOrderChatService
    {
        private readonly ISalesOrderChatRepository _chatRepository;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public SalesOrderChatService(
            ISalesOrderChatRepository chatRepository,
            IMapper mapper,
            IHttpContextAccessor httpContextAccessor)
        {
            _chatRepository = chatRepository ?? throw new ArgumentNullException(nameof(chatRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
        }

        public async Task<IEnumerable<SalesOrderChatDto>> GetAllChatMessagesAsync()
        {
            var chatMessages = await _chatRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<SalesOrderChatDto>>(chatMessages);
        }

        public async Task<SalesOrderChatDto> GetChatMessageByIdAsync(int id)
        {
            var chatMessage = await _chatRepository.GetByIdAsync(id);
            if (chatMessage == null)
                throw new NotFoundException("Chat message not found");

            return _mapper.Map<SalesOrderChatDto>(chatMessage);
        }

        public async Task<SalesOrderChatDto> CreateChatMessageAsync(CreateSalesOrderChatDto chatDto)
        {
            var chatMessage = _mapper.Map<SalesOrderChat>(chatDto);
            chatMessage.CreatedAt = DateTime.UtcNow;
            chatMessage.UpdatedAt = DateTime.UtcNow;
            
            // Get current user ID from claims
            var userIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
            {
                chatMessage.CreatedBy = userId;
            }

            var createdChatMessage = await _chatRepository.AddAsync(chatMessage);
            return _mapper.Map<SalesOrderChatDto>(createdChatMessage);
        }

        public async Task UpdateChatMessageAsync(int id, CreateSalesOrderChatDto chatDto)
        {
            var existingChatMessage = await _chatRepository.GetByIdAsync(id);
            if (existingChatMessage == null)
                throw new NotFoundException("Chat message not found");

            _mapper.Map(chatDto, existingChatMessage);
            existingChatMessage.UpdatedAt = DateTime.UtcNow;
            
            // Get current user ID from claims
            var userIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
            {
                existingChatMessage.UpdatedBy = userId;
            }

            await _chatRepository.UpdateAsync(existingChatMessage);
        }

        public async Task DeleteChatMessageAsync(int id)
        {
            var chatMessage = await _chatRepository.GetByIdAsync(id);
            if (chatMessage == null)
                throw new NotFoundException("Chat message not found");

            await _chatRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<SalesOrderChatDto>> GetChatMessagesBySalesOrderAsync(int salesOrderId)
        {
            var chatMessages = await _chatRepository.GetBySalesOrderIdAsync(salesOrderId);
            return _mapper.Map<IEnumerable<SalesOrderChatDto>>(chatMessages);
        }
    }
} 