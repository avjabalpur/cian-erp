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
    public class SalesOrderSaveTransactionService : ISalesOrderSaveTransactionService
    {
        private readonly ISalesOrderSaveTransactionRepository _saveTransactionRepository;
        private readonly IMapper _mapper;

        public SalesOrderSaveTransactionService(
            ISalesOrderSaveTransactionRepository saveTransactionRepository,
            IMapper mapper)
        {
            _saveTransactionRepository = saveTransactionRepository ?? throw new ArgumentNullException(nameof(saveTransactionRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<IEnumerable<SalesOrderSaveTransactionDto>> GetAllSaveTransactionsAsync()
        {
            var saveTransactions = await _saveTransactionRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<SalesOrderSaveTransactionDto>>(saveTransactions);
        }

        public async Task<SalesOrderSaveTransactionDto> GetSaveTransactionByIdAsync(int id)
        {
            var saveTransaction = await _saveTransactionRepository.GetByIdAsync(id);
            if (saveTransaction == null)
                throw new NotFoundException("Save transaction not found");

            return _mapper.Map<SalesOrderSaveTransactionDto>(saveTransaction);
        }

        public async Task<SalesOrderSaveTransactionDto> CreateSaveTransactionAsync(CreateSalesOrderSaveTransactionDto saveTransactionDto)
        {
            var saveTransaction = _mapper.Map<SalesOrderSaveTransaction>(saveTransactionDto);
            saveTransaction.CreatedAt = DateTime.UtcNow;
            saveTransaction.UpdatedAt = DateTime.UtcNow;

            var createdSaveTransaction = await _saveTransactionRepository.AddAsync(saveTransaction);
            return _mapper.Map<SalesOrderSaveTransactionDto>(createdSaveTransaction);
        }

        public async Task UpdateSaveTransactionAsync(int id, CreateSalesOrderSaveTransactionDto saveTransactionDto)
        {
            var existingSaveTransaction = await _saveTransactionRepository.GetByIdAsync(id);
            if (existingSaveTransaction == null)
                throw new NotFoundException("Save transaction not found");

            _mapper.Map(saveTransactionDto, existingSaveTransaction);
            existingSaveTransaction.UpdatedAt = DateTime.UtcNow;

            await _saveTransactionRepository.UpdateAsync(existingSaveTransaction);
        }

        public async Task DeleteSaveTransactionAsync(int id)
        {
            var saveTransaction = await _saveTransactionRepository.GetByIdAsync(id);
            if (saveTransaction == null)
                throw new NotFoundException("Save transaction not found");

            await _saveTransactionRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<SalesOrderSaveTransactionDto>> GetSaveTransactionsBySalesOrderAsync(int salesOrderId)
        {
            var saveTransactions = await _saveTransactionRepository.GetBySalesOrderIdAsync(salesOrderId);
            return _mapper.Map<IEnumerable<SalesOrderSaveTransactionDto>>(saveTransactions);
        }
    }
} 