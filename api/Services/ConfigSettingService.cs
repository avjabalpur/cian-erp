using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs.ConfigSetting;
using Xcianify.Core.Model;

namespace Xcianify.Services
{
    public class ConfigSettingService : IConfigSettingService
    {
        private readonly IConfigSettingRepository _configSettingRepository;
        private readonly IMapper _mapper;

        public ConfigSettingService(
            IConfigSettingRepository configSettingRepository,
            IMapper mapper)
        {
            _configSettingRepository = configSettingRepository ?? throw new ArgumentNullException(nameof(configSettingRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<PaginatedConfigSettingResultDto> GetConfigSettingsAsync(ConfigSettingFilterDto filter)
        {
            var (items, totalCount) = await _configSettingRepository.GetAllAsync(filter);

            return new PaginatedConfigSettingResultDto
            {
                Items = _mapper.Map<List<ConfigSettingDto>>(items),
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize,
            };
        }

        public async Task<ConfigSettingDto> GetConfigSettingByIdAsync(int id)
        {
            var configSetting = await _configSettingRepository.GetByIdAsync(id);
            if (configSetting == null)
            {
                throw new KeyNotFoundException($"Config setting with ID {id} not found.");
            }
            return _mapper.Map<ConfigSettingDto>(configSetting);
        }

        public async Task<ConfigSettingDto> GetConfigSettingByKeyAsync(string settingKey)
        {
            var configSetting = await _configSettingRepository.GetByKeyAsync(settingKey);
            if (configSetting == null)
            {
                throw new KeyNotFoundException($"Config setting with key '{settingKey}' not found.");
            }
            return _mapper.Map<ConfigSettingDto>(configSetting);
        }

        public async Task<ConfigSettingDto> CreateConfigSettingAsync(CreateConfigSettingDto dto)
        {
            // Check if config setting with same key already exists
            if (await _configSettingRepository.ExistsAsync(dto.SettingKey))
            {
                throw new InvalidOperationException($"A config setting with key '{dto.SettingKey}' already exists.");
            }

            var configSetting = _mapper.Map<ConfigSetting>(dto);
            
            var createdConfigSetting = await _configSettingRepository.CreateAsync(configSetting);
            return _mapper.Map<ConfigSettingDto>(createdConfigSetting);
        }

        public async Task UpdateConfigSettingAsync(UpdateConfigSettingDto dto)
        {
            var existingConfigSetting = await _configSettingRepository.GetByIdAsync(dto.Id);
            if (existingConfigSetting == null)
            {
                throw new KeyNotFoundException($"Config setting with ID {dto.Id} not found.");
            }

            // Check if another config setting with the same key exists
            if (await _configSettingRepository.ExistsAsync(dto.SettingKey, dto.Id))
            {
                throw new InvalidOperationException($"Another config setting with key '{dto.SettingKey}' already exists.");
            }

            var configSetting = _mapper.Map<ConfigSetting>(dto);
            
            await _configSettingRepository.UpdateAsync(configSetting);
        }

        public async Task DeleteConfigSettingAsync(int id)
        {
            var existingConfigSetting = await _configSettingRepository.GetByIdAsync(id);
            if (existingConfigSetting == null)
            {
                throw new KeyNotFoundException($"Config setting with ID {id} not found.");
            }

            await _configSettingRepository.DeleteAsync(id);
        }
    }
} 