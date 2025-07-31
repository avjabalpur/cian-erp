using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs.Organization;
using Xcianify.Core.Model;

namespace Xcianify.Services
{
    public class LocationTypeService : ILocationTypeService
    {
        private readonly ILocationTypeRepository _locationTypeRepository;
        private readonly IMapper _mapper;

        public LocationTypeService(
            ILocationTypeRepository locationTypeRepository,
            IMapper mapper)
        {
            _locationTypeRepository = locationTypeRepository ?? throw new ArgumentNullException(nameof(locationTypeRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<IEnumerable<LocationTypeDto>> GetAllLocationTypesAsync()
        {
            var locationTypes = await _locationTypeRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<LocationTypeDto>>(locationTypes);
        }

        public async Task<LocationTypeDto> GetLocationTypeByIdAsync(int id)
        {
            var locationType = await _locationTypeRepository.GetByIdAsync(id);
            if (locationType == null)
            {
                throw new KeyNotFoundException($"Location type with ID {id} not found.");
            }
            return _mapper.Map<LocationTypeDto>(locationType);
        }

        public async Task<LocationTypeDto> CreateLocationTypeAsync(CreateLocationTypeDto dto)
        {
            // Check if location type with same code already exists
            if (await _locationTypeRepository.ExistsAsync(dto.Code))
            {
                throw new InvalidOperationException($"A location type with code '{dto.Code}' already exists.");
            }

            var locationType = _mapper.Map<LocationType>(dto);
            locationType.CreatedAt = DateTime.UtcNow;
            locationType.UpdatedAt = DateTime.UtcNow;
            
            var createdLocationType = await _locationTypeRepository.CreateAsync(locationType);
            return _mapper.Map<LocationTypeDto>(createdLocationType);
        }

        public async Task UpdateLocationTypeAsync(UpdateLocationTypeDto dto)
        {
            var existingLocationType = await _locationTypeRepository.GetByIdAsync(dto.Id.Value);
            if (existingLocationType == null)
            {
                throw new KeyNotFoundException($"Location type with ID {dto.Id} not found.");
            }

            // Check if another location type with the same code exists
            if (await _locationTypeRepository.ExistsAsync(dto.Code) && existingLocationType.Code != dto.Code)
            {
                throw new InvalidOperationException($"Another location type with code '{dto.Code}' already exists.");
            }

            var locationType = _mapper.Map<LocationType>(dto);
            locationType.UpdatedAt = DateTime.UtcNow;
            
            await _locationTypeRepository.UpdateAsync(locationType);
        }

        public async Task DeleteLocationTypeAsync(int id)
        {
            var existingLocationType = await _locationTypeRepository.GetByIdAsync(id);
            if (existingLocationType == null)
            {
                throw new KeyNotFoundException($"Location type with ID {id} not found.");
            }

            await _locationTypeRepository.DeleteAsync(id);
        }
    }
}
