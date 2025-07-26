using Xcianify.Core.DTOs.ItemMaster;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.Exceptions;
using Xcianify.Core.DTOs;

namespace Xcianify.Services
{
    public class HsnMasterService : IHsnMasterService
    {
        private readonly IHsnMasterRepository _hsnMasterRepository;
        private bool _disposed = false;

        public HsnMasterService(IHsnMasterRepository hsnMasterRepository)
        {
            _hsnMasterRepository = hsnMasterRepository ?? throw new ArgumentNullException(nameof(hsnMasterRepository));
        }

        public async Task<HsnMasterDto> GetByIdAsync(int id)
        {
            var hsn = await _hsnMasterRepository.GetByIdAsync(id);
            if (hsn == null)
            {
                throw new NotFoundException("HSN code not found");
            }
            return hsn;
        }

        public async Task<PaginatedResult<HsnMasterDto>> GetAllAsync(HsnMasterFilterDto filter)
        {
            ValidateFilter(filter);
            return await _hsnMasterRepository.GetAllAsync(filter);
        }

        public async Task<HsnMasterDto> CreateAsync(CreateHsnMasterDto dto, int userId)
        {
            ValidateCreateDto(dto);
            
            // Check if HSN code already exists
            if (await _hsnMasterRepository.ExistsAsync(dto.Code))
            {
                throw new ValidationException("HSN code already exists");
            }

            return await _hsnMasterRepository.CreateAsync(dto, userId);
        }

        public async Task<HsnMasterDto> UpdateAsync(int id, UpdateHsnMasterDto dto, int userId)
        {
            // Check if HSN code exists
            var existingHsn = await _hsnMasterRepository.GetByIdAsync(id);
            if (existingHsn == null)
            {
                throw new NotFoundException("HSN code not found");
            }

            ValidateUpdateDto(dto);

            // Check if new code is already taken by another record
            if (dto.Code != null && dto.Code != existingHsn.Code)
            {
                if (await _hsnMasterRepository.ExistsAsync(dto.Code, id))
                {
                    throw new ValidationException("HSN code already exists");
                }
            }

            return await _hsnMasterRepository.UpdateAsync(id, dto, userId);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            // Check if HSN code exists
            var existingHsn = await _hsnMasterRepository.GetByIdAsync(id);
            if (existingHsn == null)
            {
                throw new NotFoundException("HSN code not found");
            }

            // Add any business rules for deletion here
            // For example, check if the HSN code is being used by any items

            return await _hsnMasterRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<HsnMasterDto>> GetHsnTypesAsync()
        {
            return await _hsnMasterRepository.GetHsnTypesAsync();
        }

        private void ValidateFilter(HsnMasterFilterDto filter)
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

            if (filter.HsnType != null && filter.HsnType.Length > 1)
            {
                throw new ValidationException("HSN type cannot exceed 1 character");
            }
        }

        private void ValidateCreateDto(CreateHsnMasterDto dto)
        {
            if (dto == null)
            {
                throw new ValidationException("HSN data is required");
            }

            if (string.IsNullOrWhiteSpace(dto.Code))
            {
                throw new ValidationException("HSN code is required");
            }

            if (dto.Code.Length > 10)
            {
                throw new ValidationException("HSN code cannot exceed 10 characters");
            }

            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                throw new ValidationException("HSN name is required");
            }

            if (dto.Name.Length > 100)
            {
                throw new ValidationException("HSN name cannot exceed 100 characters");
            }

            if (dto.HsnType != null && dto.HsnType.Length > 1)
            {
                throw new ValidationException("HSN type cannot exceed 1 character");
            }

            if (dto.Uqc != null && dto.Uqc.Length > 50)
            {
                throw new ValidationException("UQC cannot exceed 50 characters");
            }

            ValidateTaxRates(dto.IgstRate, dto.CgstRate, dto.SgstRate, dto.CessRate);
        }

        private void ValidateUpdateDto(UpdateHsnMasterDto dto)
        {
            if (dto == null)
            {
                throw new ValidationException("HSN data is required");
            }

            if (dto.Code != null)
            {
                if (string.IsNullOrWhiteSpace(dto.Code))
                {
                    throw new ValidationException("HSN code cannot be empty");
                }

                if (dto.Code.Length > 10)
                {
                    throw new ValidationException("HSN code cannot exceed 10 characters");
                }
            }

            if (dto.Name != null && string.IsNullOrWhiteSpace(dto.Name))
            {
                throw new ValidationException("HSN name cannot be empty");
            }

            if (dto.Name != null && dto.Name.Length > 100)
            {
                throw new ValidationException("HSN name cannot exceed 100 characters");
            }

            if (dto.HsnType != null && dto.HsnType.Length > 1)
            {
                throw new ValidationException("HSN type cannot exceed 1 character");
            }

            if (dto.Uqc != null && dto.Uqc.Length > 50)
            {
                throw new ValidationException("UQC cannot exceed 50 characters");
            }

            // Only validate tax rates if they are being updated
            if (dto.IgstRate.HasValue || dto.CgstRate.HasValue || dto.SgstRate.HasValue || dto.CessRate.HasValue)
            {
                ValidateTaxRates(dto.IgstRate, dto.CgstRate, dto.SgstRate, dto.CessRate);
            }
        }

        private void ValidateTaxRates(decimal? igstRate, decimal? cgstRate, decimal? sgstRate, decimal? cessRate)
        {
            if (igstRate.HasValue && (igstRate < 0 || igstRate > 100))
            {
                throw new ValidationException("IGST rate must be between 0 and 100");
            }

            if (cgstRate.HasValue && (cgstRate < 0 || cgstRate > 100))
            {
                throw new ValidationException("CGST rate must be between 0 and 100");
            }

            if (sgstRate.HasValue && (sgstRate < 0 || sgstRate > 100))
            {
                throw new ValidationException("SGST rate must be between 0 and 100");
            }

            if (cessRate.HasValue && (cessRate < 0 || cessRate > 100))
            {
                throw new ValidationException("Cess rate must be between 0 and 100");
            }
        }
    }
}
