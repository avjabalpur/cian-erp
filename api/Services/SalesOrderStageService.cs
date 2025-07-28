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
    public class SalesOrderStageService : ISalesOrderStageService
    {
        private readonly ISalesOrderStageRepository _salesOrderStageRepository;
        private readonly IMapper _mapper;

        public SalesOrderStageService(
            ISalesOrderStageRepository salesOrderStageRepository,
            IMapper mapper)
        {
            _salesOrderStageRepository = salesOrderStageRepository ?? throw new ArgumentNullException(nameof(salesOrderStageRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<IEnumerable<SalesOrderStageDto>> GetAllStagesAsync()
        {
            var stages = await _salesOrderStageRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<SalesOrderStageDto>>(stages);
        }

        public async Task<SalesOrderStageDto> GetStageByIdAsync(int id)
        {
            var stage = await _salesOrderStageRepository.GetByIdAsync(id);
            if (stage == null)
                throw new NotFoundException("Sales order stage not found");

            return _mapper.Map<SalesOrderStageDto>(stage);
        }

        public async Task<SalesOrderStageDto> CreateStageAsync(CreateSalesOrderStageDto stageDto)
        {
            var stage = _mapper.Map<SalesOrderStage>(stageDto);
            var createdStage = await _salesOrderStageRepository.AddAsync(stage);
            return _mapper.Map<SalesOrderStageDto>(createdStage);
        }

        public async Task UpdateStageAsync(int id, CreateSalesOrderStageDto stageDto)
        {
            var existingStage = await _salesOrderStageRepository.GetByIdAsync(id);
            if (existingStage == null)
                throw new NotFoundException("Sales order stage not found");

            _mapper.Map(stageDto, existingStage);
            existingStage.UpdatedAt = DateTime.UtcNow;

            await _salesOrderStageRepository.UpdateAsync(existingStage);
        }

        public async Task DeleteStageAsync(int id)
        {
            var stage = await _salesOrderStageRepository.GetByIdAsync(id);
            if (stage == null)
                throw new NotFoundException("Sales order stage not found");

            await _salesOrderStageRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<SalesOrderStageDto>> GetStagesBySalesOrderAsync(int salesOrderId)
        {
            var stages = await _salesOrderStageRepository.GetBySalesOrderIdAsync(salesOrderId);
            return _mapper.Map<IEnumerable<SalesOrderStageDto>>(stages);
        }

        public async Task<SalesOrderStageDto> GetStageBySalesOrderAndNameAsync(int salesOrderId, string stageName)
        {
            var stage = await _salesOrderStageRepository.GetBySalesOrderIdAndStageNameAsync(salesOrderId, stageName);
            if (stage == null)
                throw new NotFoundException("Sales order stage not found");

            return _mapper.Map<SalesOrderStageDto>(stage);
        }

        public async Task<bool> ApproveStageAsync(int salesOrderId, string stageName)
        {
            var stage = await _salesOrderStageRepository.GetBySalesOrderIdAndStageNameAsync(salesOrderId, stageName);
            if (stage == null)
            {
                // Create new stage if it doesn't exist
                var createDto = new CreateSalesOrderStageDto
                {
                    SalesOrderId = salesOrderId,
                    StageName = stageName,
                    IsApproved = true
                };
                await CreateStageAsync(createDto);
                return true;
            }

            stage.IsApproved = true;
            stage.UpdatedAt = DateTime.UtcNow;
            await _salesOrderStageRepository.UpdateAsync(stage);
            return true;
        }

        public async Task<bool> RejectStageAsync(int salesOrderId, string stageName)
        {
            var stage = await _salesOrderStageRepository.GetBySalesOrderIdAndStageNameAsync(salesOrderId, stageName);
            if (stage == null)
            {
                // Create new stage if it doesn't exist
                var createDto = new CreateSalesOrderStageDto
                {
                    SalesOrderId = salesOrderId,
                    StageName = stageName,
                    IsApproved = false
                };
                await CreateStageAsync(createDto);
                return true;
            }

            stage.IsApproved = false;
            stage.UpdatedAt = DateTime.UtcNow;
            await _salesOrderStageRepository.UpdateAsync(stage);
            return true;
        }
    }
} 