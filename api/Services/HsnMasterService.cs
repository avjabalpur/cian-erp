using Xcianify.Core.DTOs.ItemMaster;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.Exceptions;
using Xcianify.Core.DTOs;
using Xcianify.Core.Model;

namespace Xcianify.Services
{
    public class HsnMasterService : IHsnMasterService
    {
        private readonly IHsnMasterRepository _hsnMasterRepository;

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
            return MapToDto(hsn);
        }

        public async Task<PaginatedResult<HsnMasterDto>> GetAllAsync(HsnMasterFilterDto filter)
        {
            ValidateFilter(filter);
            var (items, totalCount) = await _hsnMasterRepository.GetAllAsync(filter);
            var dtos = items.Select(MapToDto).ToList();
            
            return new PaginatedResult<HsnMasterDto>
            {
                Items = dtos,
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize
            };
        }

        public async Task<HsnMasterDto> CreateAsync(CreateHsnMasterDto dto, int userId)
        {
            ValidateCreateDto(dto);
            
            // Check if HSN code already exists
            if (await _hsnMasterRepository.ExistsAsync(dto.Code))
            {
                throw new ValidationException("HSN code already exists");
            }

            var hsnMaster = new HsnMaster
            {
                Code = dto.Code,
                Name = dto.Name,
                Description = dto.Description,
                HsnType = dto.HsnType,
                Uqc = dto.Uqc,
                IgstRate = dto.IgstRate ?? 0,
                CgstRate = dto.CgstRate ?? 0,
                SgstRate = dto.SgstRate ?? 0,
                CessRate = dto.CessRate ?? 0,
                IsReverseCharges = dto.IsReverseCharges ?? false,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                CreatedBy = userId,
                UpdatedBy = userId
            };

            var created = await _hsnMasterRepository.AddAsync(hsnMaster);
            return MapToDto(created);
        }

        public async Task<HsnMasterDto> UpdateAsync(int id, UpdateHsnMasterDto dto, int userId)
        {
            ValidateUpdateDto(dto);
            
            var hsnMaster = await _hsnMasterRepository.GetByIdAsync(id);
            if (hsnMaster == null)
            {
                throw new NotFoundException("HSN code not found");
            }

            // Check if HSN code already exists (excluding current record)
            if (await _hsnMasterRepository.ExistsAsync(dto.Code, id))
            {
                throw new ValidationException("HSN code already exists");
            }

            hsnMaster.Code = dto.Code;
            hsnMaster.Name = dto.Name;
            hsnMaster.Description = dto.Description;
            hsnMaster.HsnType = dto.HsnType;
            hsnMaster.Uqc = dto.Uqc;
            if (dto.IgstRate.HasValue) hsnMaster.IgstRate = dto.IgstRate.Value;
            if (dto.CgstRate.HasValue) hsnMaster.CgstRate = dto.CgstRate.Value;
            if (dto.SgstRate.HasValue) hsnMaster.SgstRate = dto.SgstRate.Value;
            if (dto.CessRate.HasValue) hsnMaster.CessRate = dto.CessRate.Value;
            if (dto.IsReverseCharges.HasValue) hsnMaster.IsReverseCharges = dto.IsReverseCharges.Value;
            if (dto.IsActive.HasValue) hsnMaster.IsActive = dto.IsActive.Value;
            hsnMaster.UpdatedBy = userId;

            await _hsnMasterRepository.UpdateAsync(hsnMaster);
            return MapToDto(hsnMaster);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var hsnMaster = await _hsnMasterRepository.GetByIdAsync(id);
            if (hsnMaster == null)
            {
                throw new NotFoundException("HSN code not found");
            }

            await _hsnMasterRepository.DeleteAsync(id);
            return true;
        }

        public async Task<IEnumerable<HsnMasterDto>> GetHsnTypesAsync()
        {
            var hsnTypes = await _hsnMasterRepository.GetHsnTypesAsync();
            return hsnTypes.Select(MapToDto);
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
        }

        private void ValidateCreateDto(CreateHsnMasterDto dto)
        {
            if (dto == null)
            {
                throw new ValidationException("HSN data cannot be null");
            }

            if (string.IsNullOrWhiteSpace(dto.Code))
            {
                throw new ValidationException("HSN code is required");
            }

            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                throw new ValidationException("HSN name is required");
            }

            if (dto.IgstRate < 0 || dto.IgstRate > 100)
            {
                throw new ValidationException("IGST rate must be between 0 and 100");
            }

            if (dto.CgstRate < 0 || dto.CgstRate > 100)
            {
                throw new ValidationException("CGST rate must be between 0 and 100");
            }

            if (dto.SgstRate < 0 || dto.SgstRate > 100)
            {
                throw new ValidationException("SGST rate must be between 0 and 100");
            }

            if (dto.CessRate < 0 || dto.CessRate > 100)
            {
                throw new ValidationException("Cess rate must be between 0 and 100");
            }
        }

        private void ValidateUpdateDto(UpdateHsnMasterDto dto)
        {
            if (dto == null)
            {
                throw new ValidationException("HSN data cannot be null");
            }

            if (string.IsNullOrWhiteSpace(dto.Code))
            {
                throw new ValidationException("HSN code is required");
            }

            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                throw new ValidationException("HSN name is required");
            }

            if (dto.IgstRate.HasValue && (dto.IgstRate < 0 || dto.IgstRate > 100))
            {
                throw new ValidationException("IGST rate must be between 0 and 100");
            }

            if (dto.CgstRate.HasValue && (dto.CgstRate < 0 || dto.CgstRate > 100))
            {
                throw new ValidationException("CGST rate must be between 0 and 100");
            }

            if (dto.SgstRate.HasValue && (dto.SgstRate < 0 || dto.SgstRate > 100))
            {
                throw new ValidationException("SGST rate must be between 0 and 100");
            }

            if (dto.CessRate.HasValue && (dto.CessRate < 0 || dto.CessRate > 100))
            {
                throw new ValidationException("Cess rate must be between 0 and 100");
            }
        }

        private HsnMasterDto MapToDto(HsnMaster hsnMaster)
        {
            if (hsnMaster == null) return null;
            
            return new HsnMasterDto
            {
                Id = hsnMaster.Id,
                Code = hsnMaster.Code,
                Name = hsnMaster.Name,
                Description = hsnMaster.Description,
                HsnType = hsnMaster.HsnType,
                Uqc = hsnMaster.Uqc,
                IgstRate = hsnMaster.IgstRate,
                CgstRate = hsnMaster.CgstRate,
                SgstRate = hsnMaster.SgstRate,
                CessRate = hsnMaster.CessRate,
                IsReverseCharges = hsnMaster.IsReverseCharges,
                IsActive = hsnMaster.IsActive,
                CreatedAt = hsnMaster.CreatedAt,
                UpdatedAt = hsnMaster.UpdatedAt,
                CreatedBy = hsnMaster.CreatedBy,
                UpdatedBy = hsnMaster.UpdatedBy
            };
        }
    }
}
