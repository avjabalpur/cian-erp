using AutoMapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;
using Xcianify.Core.DTOs.ConfigList;
using Xcianify.Core.DTOs;
using Xcianify.Core.Domain.Services;

namespace Xcianify.Services
{
    public class ConfigListService : IConfigListService
    {
        private readonly IConfigListRepository _configListRepository;
        private readonly IMapper _mapper;

        public ConfigListService(IConfigListRepository configListRepository, IMapper mapper)
        {
            _configListRepository = configListRepository;
            _mapper = mapper;
        }

        public async Task<PaginatedResult<ConfigListDto>> GetAllAsync(ConfigListFilterDto filter)
        {
            var (items, totalCount) = await _configListRepository.GetAllAsync(
                filter.Search,
                filter.IsActive,
                filter.PageNumber,
                filter.PageSize);

            var dtos = _mapper.Map<List<ConfigListDto>>(items);

            return new PaginatedResult<ConfigListDto>
            {
                Items = dtos,
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize
            };
        }

        public async Task<ConfigListDto?> GetByIdAsync(int id)
        {
            var item = await _configListRepository.GetByIdAsync(id);
            return _mapper.Map<ConfigListDto>(item);
        }

        public async Task<ConfigListDto> CreateAsync(CreateConfigListDto createDto)
        {
            var configList = _mapper.Map<ConfigList>(createDto);
            configList.CreatedAt = DateTime.UtcNow;

            var result = await _configListRepository.AddAsync(configList);
            return _mapper.Map<ConfigListDto>(result);
        }

        public async Task<ConfigListDto> UpdateAsync(int id, UpdateConfigListDto updateDto)
        {
            var existingItem = await _configListRepository.GetByIdAsync(id);
            if (existingItem == null)
                throw new ArgumentException("Config list not found", nameof(id));

            _mapper.Map(updateDto, existingItem);
            existingItem.UpdatedAt = DateTime.UtcNow;

            var result = await _configListRepository.UpdateAsync(existingItem);
            return _mapper.Map<ConfigListDto>(result);
        }

        public async Task DeleteAsync(int id)
        {
            await _configListRepository.DeleteAsync(id);
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _configListRepository.ExistsAsync(id);
        }

        public async Task<bool> ExistsByCodeAsync(string listCode, int? excludeId = null)
        {
            return await _configListRepository.ExistsByCodeAsync(listCode, excludeId);
        }

        public async Task<ConfigListDto?> GetByCodeAsync(string listCode)
        {
            var item = await _configListRepository.GetByCodeAsync(listCode);
            return _mapper.Map<ConfigListDto>(item);
        }
    }

  
} 