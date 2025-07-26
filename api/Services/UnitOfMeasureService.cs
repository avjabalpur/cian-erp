using System;
using System.Threading.Tasks;
using Xcianify.Core.DTOs.ItemMaster;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.Exceptions;
using Xcianify.Core.DTOs;

namespace Xcianify.Services
{
    public class UnitOfMeasureService : IUnitOfMeasureService
    {
        private readonly IUnitOfMeasureRepository _unitOfMeasureRepository;

        public UnitOfMeasureService(IUnitOfMeasureRepository unitOfMeasureRepository)
        {
            _unitOfMeasureRepository = unitOfMeasureRepository ?? throw new ArgumentNullException(nameof(unitOfMeasureRepository));
        }

        public async Task<UnitOfMeasureDto> GetByIdAsync(int id)
        {
            var uom = await _unitOfMeasureRepository.GetByIdAsync(id);
            if (uom == null)
            {
                throw new NotFoundException("Unit of measure not found");
            }
            return uom;
        }

        public async Task<PaginatedResult<UnitOfMeasureDto>> GetAllAsync(UnitOfMeasureFilterDto filter)
        {
            ValidateFilter(filter);
            return await _unitOfMeasureRepository.GetAllAsync(filter);
        }

        public async Task<UnitOfMeasureDto> CreateAsync(CreateUnitOfMeasureDto dto, int userId)
        {
            ValidateCreateDto(dto);
            
            // Check if UOM code already exists
            if (await _unitOfMeasureRepository.ExistsAsync(dto.UomCode))
            {
                throw new ValidationException("UOM code already exists");
            }

            return await _unitOfMeasureRepository.CreateAsync(dto, userId);
        }

        public async Task<UnitOfMeasureDto> UpdateAsync(int id, UpdateUnitOfMeasureDto dto, int userId)
        {
            // Check if UOM exists
            var existingUom = await _unitOfMeasureRepository.GetByIdAsync(id);
            if (existingUom == null)
            {
                throw new NotFoundException("Unit of measure not found");
            }

            ValidateUpdateDto(dto);

            // Check if new UOM code is already taken by another record
            if (dto.UomCode != null && dto.UomCode != existingUom.UomCode)
            {
                if (await _unitOfMeasureRepository.ExistsAsync(dto.UomCode, id))
                {
                    throw new ValidationException("UOM code already exists");
                }
            }

            return await _unitOfMeasureRepository.UpdateAsync(id, dto, userId);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            // Check if UOM exists
            var existingUom = await _unitOfMeasureRepository.GetByIdAsync(id);
            if (existingUom == null)
            {
                throw new NotFoundException("Unit of measure not found");
            }

            // Add any business rules for deletion here
            // For example, check if the UOM is being used by any items

            return await _unitOfMeasureRepository.DeleteAsync(id);
        }

        private void ValidateFilter(UnitOfMeasureFilterDto filter)
        {
            if (filter == null)
            {
                throw new ValidationException("Filter cannot be null");
            }

            if (filter.PageNumber < 1)
            {
                throw new ValidationException("Page number must be greater than 0");
            }

            if (filter.PageSize < 1 || filter.PageSize > 100)
            {
                throw new ValidationException("Page size must be between 1 and 100");
            }
        }

        private void ValidateCreateDto(CreateUnitOfMeasureDto dto)
        {
            if (dto == null)
            {
                throw new ValidationException("Unit of measure data is required");
            }

            if (string.IsNullOrWhiteSpace(dto.UomCode))
            {
                throw new ValidationException("UOM code is required");
            }

            if (dto.UomCode.Length > 10)
            {
                throw new ValidationException("UOM code cannot exceed 10 characters");
            }

            if (string.IsNullOrWhiteSpace(dto.UomName))
            {
                throw new ValidationException("UOM name is required");
            }

            if (dto.UomName.Length > 50)
            {
                throw new ValidationException("UOM name cannot exceed 50 characters");
            }

            if (dto.ConversionFactor.HasValue && dto.ConversionFactor <= 0)
            {
                throw new ValidationException("Conversion factor must be greater than 0");
            }
        }

        private void ValidateUpdateDto(UpdateUnitOfMeasureDto dto)
        {
            if (dto == null)
            {
                throw new ValidationException("Unit of measure data is required");
            }

            if (dto.UomCode != null && string.IsNullOrWhiteSpace(dto.UomCode))
            {
                throw new ValidationException("UOM code cannot be empty");
            }

            if (dto.UomCode != null && dto.UomCode.Length > 10)
            {
                throw new ValidationException("UOM code cannot exceed 10 characters");
            }

            if (dto.UomName != null && string.IsNullOrWhiteSpace(dto.UomName))
            {
                throw new ValidationException("UOM name cannot be empty");
            }

            if (dto.UomName != null && dto.UomName.Length > 50)
            {
                throw new ValidationException("UOM name cannot exceed 50 characters");
            }

            if (dto.ConversionFactor.HasValue && dto.ConversionFactor <= 0)
            {
                throw new ValidationException("Conversion factor must be greater than 0");
            }
        }

    }
}
