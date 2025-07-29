using AutoMapper;
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
        private readonly IMapper _mapper;

        public HsnMasterService(
            IHsnMasterRepository hsnMasterRepository,
            IMapper mapper)
        {
            _hsnMasterRepository = hsnMasterRepository ?? throw new ArgumentNullException(nameof(hsnMasterRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<HsnMasterDto> GetByIdAsync(int id)
        {
            var hsn = await _hsnMasterRepository.GetByIdAsync(id);
            if (hsn == null)
            {
                throw new NotFoundException("HSN code not found");
            }
            return _mapper.Map<HsnMasterDto>(hsn);
        }

        public async Task<PaginatedResult<HsnMasterDto>> GetAllAsync(HsnMasterFilterDto filter)
        {
            var (items, totalCount) = await _hsnMasterRepository.GetAllAsync(filter);
            var dtos = _mapper.Map<IEnumerable<HsnMasterDto>>(items).ToList();
            
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
            
            // Check if HSN code already exists
            if (await _hsnMasterRepository.ExistsAsync(dto.Code))
            {
                throw new ValidationException("HSN code already exists");
            }
            var hsnMaster = _mapper.Map<HsnMaster>(dto);
            hsnMaster.CreatedAt = DateTime.UtcNow;
            hsnMaster.UpdatedAt = DateTime.UtcNow;
            hsnMaster.CreatedBy = userId;
            hsnMaster.UpdatedBy = userId;

            var created = await _hsnMasterRepository.AddAsync(hsnMaster);
            return _mapper.Map<HsnMasterDto>(created);
        }

        public async Task<HsnMasterDto> UpdateAsync(int id, UpdateHsnMasterDto dto, int userId)
        {
            
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

            _mapper.Map(dto, hsnMaster);
            hsnMaster.UpdatedBy = userId;
            hsnMaster.UpdatedAt = DateTime.UtcNow;

            await _hsnMasterRepository.UpdateAsync(hsnMaster);
            return _mapper.Map<HsnMasterDto>(hsnMaster);
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
            return _mapper.Map<IEnumerable<HsnMasterDto>>(hsnTypes);
        }


    }
}
