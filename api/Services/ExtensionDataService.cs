using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs.ExtensionData;
using Xcianify.Core.Exceptions;
using Xcianify.Core.Model;

namespace Xcianify.Services
{
    public class ExtensionDataService : IExtensionDataService
    {
        private readonly IExtensionDataRepository _repository;
        private readonly IMapper _mapper;

        public ExtensionDataService(
            IExtensionDataRepository repository,
            IMapper mapper)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<ExtensionDataDto> GetByIdAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null)
                throw new NotFoundException("ExtensionData not found");
            return _mapper.Map<ExtensionDataDto>(entity);
        }

        public async Task<IEnumerable<ExtensionDataDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<ExtensionDataDto>>(entities);
        }

        public async Task<IEnumerable<ExtensionDataDto>> GetByEntityTypeAsync(string entityType)
        {
            if (string.IsNullOrWhiteSpace(entityType))
                throw new ArgumentException("EntityType cannot be null or empty");

            var entities = await _repository.GetByEntityTypeAsync(entityType);
            return _mapper.Map<IEnumerable<ExtensionDataDto>>(entities);
        }

        public async Task<IEnumerable<ExtensionDataDto>> GetByEntityTypeAndIdAsync(string entityType, int entityTypeId)
        {
            if (string.IsNullOrWhiteSpace(entityType))
                throw new ArgumentException("EntityType cannot be null or empty");

            if (entityTypeId <= 0)
                throw new ArgumentException("EntityTypeId must be greater than 0");

            var entities = await _repository.GetByEntityTypeAndIdAsync(entityType, entityTypeId);
            return _mapper.Map<IEnumerable<ExtensionDataDto>>(entities);
        }

        public async Task<IEnumerable<ExtensionDataDto>> GetActiveAsync()
        {
            var entities = await _repository.GetActiveAsync();
            return _mapper.Map<IEnumerable<ExtensionDataDto>>(entities);
        }

        public async Task<ExtensionDataDto> CreateAsync(CreateExtensionDataDto createDto, int userId)
        {
            if (createDto == null)
                throw new ArgumentNullException(nameof(createDto));

            if (string.IsNullOrWhiteSpace(createDto.EntityType))
                throw new ArgumentException("EntityType is required");

            if (string.IsNullOrWhiteSpace(createDto.PropertyKey))
                throw new ArgumentException("PropertyKey is required");

            if (string.IsNullOrWhiteSpace(createDto.PropertyLabel))
                throw new ArgumentException("PropertyLabel is required");

            var entity = new ExtensionData
            {
                EntityType = createDto.EntityType,
                EntityTypeId = createDto.EntityTypeId,
                PropertyKey = createDto.PropertyKey,
                PropertyLabel = createDto.PropertyLabel,
                PropertyDescription = createDto.PropertyDescription,
                PropertyValue = createDto.PropertyValue,
                DataType = createDto.DataType ?? "text",
                DisplayOrder = createDto.DisplayOrder,
                IsActive = true,
                IsDeleted = false,
                CreatedBy = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedBy = userId,
                UpdatedAt = DateTime.UtcNow
            };

            var id = await _repository.CreateAsync(entity);
            entity.Id = id;
            return _mapper.Map<ExtensionDataDto>(entity);
        }

        public async Task<ExtensionDataDto> UpdateAsync(int id, UpdateExtensionDataDto updateDto, int userId)
        {
            if (updateDto == null)
                throw new ArgumentNullException(nameof(updateDto));

            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                throw new NotFoundException("ExtensionData not found");

            if (string.IsNullOrWhiteSpace(updateDto.PropertyKey))
                throw new ArgumentException("PropertyKey is required");

            if (string.IsNullOrWhiteSpace(updateDto.PropertyLabel))
                throw new ArgumentException("PropertyLabel is required");

            var entity = new ExtensionData
            {
                Id = id,
                EntityType = existing.EntityType, // Preserve original entity type
                EntityTypeId = existing.EntityTypeId, // Preserve original entity type id
                PropertyKey = updateDto.PropertyKey,
                PropertyLabel = updateDto.PropertyLabel,
                PropertyDescription = updateDto.PropertyDescription,
                PropertyValue = updateDto.PropertyValue,
                DataType = updateDto.DataType ?? existing.DataType,
                DisplayOrder = updateDto.DisplayOrder,
                IsActive = updateDto.IsActive,
                IsDeleted = false,
                CreatedBy = existing.CreatedBy,
                CreatedAt = existing.CreatedAt,
                UpdatedBy = userId,
                UpdatedAt = DateTime.UtcNow
            };

            var success = await _repository.UpdateAsync(entity);
            if (!success)
                throw new ApplicationException("Failed to update ExtensionData");

            return _mapper.Map<ExtensionDataDto>(entity);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                throw new NotFoundException("ExtensionData not found");

            return await _repository.DeleteAsync(id);
        }
    }
}
