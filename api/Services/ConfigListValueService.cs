using AutoMapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;
using Xcianify.Core.DTOs.ConfigList;
using Xcianify.Core.DTOs;
using Xcianify.Core.Domain.Services;

namespace Xcianify.Services
{
    public class ConfigListValueService : IConfigListValueService
    {
        private readonly IConfigListValueRepository _configListValueRepository;
        private readonly IMapper _mapper;

        public ConfigListValueService(IConfigListValueRepository configListValueRepository, IMapper mapper)
        {
            _configListValueRepository = configListValueRepository;
            _mapper = mapper;
        }

        public async Task<ConfigListValueDto?> GetByIdAsync(int id)
        {
            var item = await _configListValueRepository.GetByIdAsync(id);
            return _mapper.Map<ConfigListValueDto>(item);
        }

        public async Task<List<ConfigListValueDto>> GetByListIdAsync(int listId)
        {
            var items = await _configListValueRepository.GetByListIdAsync(listId);
            return _mapper.Map<List<ConfigListValueDto>>(items);
        }

        public async Task<ConfigListValueDto> CreateAsync(CreateConfigListValueDto createDto)
        {
            var configListValue = _mapper.Map<ConfigListValue>(createDto);
            configListValue.CreatedAt = DateTime.UtcNow;

            var result = await _configListValueRepository.AddAsync(configListValue);
            return _mapper.Map<ConfigListValueDto>(result);
        }

        public async Task<ConfigListValueDto> UpdateAsync(int id, UpdateConfigListValueDto updateDto)
        {
            var existingItem = await _configListValueRepository.GetByIdAsync(id);
            if (existingItem == null)
                throw new ArgumentException("Config list value not found", nameof(id));

            _mapper.Map(updateDto, existingItem);
            existingItem.UpdatedAt = DateTime.UtcNow;

            var result = await _configListValueRepository.UpdateAsync(existingItem);
            return _mapper.Map<ConfigListValueDto>(result);
        }

        public async Task DeleteAsync(int id)
        {
            await _configListValueRepository.DeleteAsync(id);
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _configListValueRepository.ExistsAsync(id);
        }

        public async Task<bool> ExistsByCodeAsync(int listId, string valueCode, int? excludeId = null)
        {
            return await _configListValueRepository.ExistsByCodeAsync(listId, valueCode, excludeId);
        }
    }

    
} 