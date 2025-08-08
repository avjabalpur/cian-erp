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
    public class SalesOrderService : ISalesOrderService
    {
        private readonly ISalesOrderRepository _salesOrderRepository;
        private readonly IMapper _mapper;

        public SalesOrderService(
            ISalesOrderRepository salesOrderRepository,
            IMapper mapper)
        {
            _salesOrderRepository = salesOrderRepository ?? throw new ArgumentNullException(nameof(salesOrderRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<(IEnumerable<SalesOrderDto> Items, int TotalCount)> GetAllAsync(SalesOrderFilterDto filterDto)
        {
            var (salesOrders, totalCount) = await _salesOrderRepository.GetAllAsync(filterDto);
            return (_mapper.Map<IEnumerable<SalesOrderDto>>(salesOrders), totalCount);
        }

        public async Task<SalesOrderDto> GetByIdAsync(int id)
        {
            var salesOrder = await _salesOrderRepository.GetByIdAsync(id);
            if (salesOrder == null)
                throw new NotFoundException("Sales order not found");

            return _mapper.Map<SalesOrderDto>(salesOrder);
        }

        public async Task<SalesOrderDto> GetBySoNumberAsync(string soNumber)
        {
            var salesOrder = await _salesOrderRepository.GetBySoNumberAsync(soNumber);
            if (salesOrder == null)
                throw new NotFoundException("Sales order not found");

            return _mapper.Map<SalesOrderDto>(salesOrder);
        }

        public async Task<SalesOrderDto> CreateAsync(CreateSalesOrderDto salesOrderDto)
        {
            // Check if SO number already exists
            if (await _salesOrderRepository.SoNumberExistsAsync(salesOrderDto.SoNumber))
                throw new ValidationException("Sales order number already exists");

            var salesOrder = _mapper.Map<SalesOrder>(salesOrderDto);
            salesOrder.CreatedAt = DateTime.UtcNow;
            salesOrder.UpdatedAt = DateTime.UtcNow;
            salesOrder.IsDeleted = false;
            salesOrder.IsSubmitted = false;

            var createdSalesOrder = await _salesOrderRepository.AddAsync(salesOrder);
            return _mapper.Map<SalesOrderDto>(createdSalesOrder);
        }

        public async Task UpdateAsync(UpdateSalesOrderDto salesOrderDto)
        {
            var existingSalesOrder = await _salesOrderRepository.GetByIdAsync(salesOrderDto.Id);
            if (existingSalesOrder == null)
                throw new NotFoundException("Sales order not found");

            // Check if SO number is being changed and already exists
            if (!string.Equals(existingSalesOrder.SoNumber, salesOrderDto.SoNumber, StringComparison.OrdinalIgnoreCase))
            {
                if (await _salesOrderRepository.SoNumberExistsAsync(salesOrderDto.SoNumber, salesOrderDto.Id))
                    throw new ValidationException("Sales order number already in use by another order");
            }

            _mapper.Map(salesOrderDto, existingSalesOrder);
            existingSalesOrder.UpdatedAt = DateTime.UtcNow;

            await _salesOrderRepository.UpdateAsync(existingSalesOrder);
        }

        public async Task DeleteAsync(int id)
        {
            var salesOrder = await _salesOrderRepository.GetByIdAsync(id);
            if (salesOrder == null)
                throw new NotFoundException("Sales order not found");

            await _salesOrderRepository.DeleteAsync(id);
        }

        public async Task<string> GenerateSoNumberAsync()
        {
            var nextNumber = await _salesOrderRepository.GetNextSoNumberAsync();
            return $"SO{nextNumber:D6}";
        }

        public async Task<bool> SubmitAsync(int id)
        {
            var salesOrder = await _salesOrderRepository.GetByIdAsync(id);
            if (salesOrder == null)
                throw new NotFoundException("Sales order not found");

            if (salesOrder.IsSubmitted)
                throw new ValidationException("Sales order is already submitted");

            salesOrder.IsSubmitted = true;
            salesOrder.SoStatus = "Submitted";
            salesOrder.CurrentStatus = "Submitted";
            salesOrder.UpdatedAt = DateTime.UtcNow;

            await _salesOrderRepository.UpdateAsync(salesOrder);
            return true;
        }

        public async Task<bool> ApproveAsync(int id)
        {
            var salesOrder = await _salesOrderRepository.GetByIdAsync(id);
            if (salesOrder == null)
                throw new NotFoundException("Sales order not found");

            if (!salesOrder.IsSubmitted)
                throw new ValidationException("Sales order must be submitted before approval");

            salesOrder.SoStatus = "Approved";
            salesOrder.CurrentStatus = "Approved";
            salesOrder.UpdatedAt = DateTime.UtcNow;

            await _salesOrderRepository.UpdateAsync(salesOrder);
            return true;
        }

        public async Task<bool> RejectAsync(int id)
        {
            var salesOrder = await _salesOrderRepository.GetByIdAsync(id);
            if (salesOrder == null)
                throw new NotFoundException("Sales order not found");

            if (!salesOrder.IsSubmitted)
                throw new ValidationException("Sales order must be submitted before rejection");

            salesOrder.SoStatus = "Rejected";
            salesOrder.CurrentStatus = "Rejected";
            salesOrder.UpdatedAt = DateTime.UtcNow;

            await _salesOrderRepository.UpdateAsync(salesOrder);
            return true;
        }

        public async Task<int> CreateApprovalAsync(CreateSalesOrderApprovalDto approvalDto, int currentUserId)
        {
            return await _salesOrderRepository.CreateApprovalAsync(
                approvalDto.SoStatus,
                approvalDto.DosageName,
                currentUserId
            );
        }
    }
} 